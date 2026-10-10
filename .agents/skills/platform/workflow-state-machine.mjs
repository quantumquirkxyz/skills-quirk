// workflow-state-machine.mjs - executable state machine for platform/workflows/*.yaml
//
// Commands:
//   <workflow> current          print the current state (text, or --json)
//   <workflow> legal-events     print the events legal from the current state
//                               AFTER guard evaluation (text, or --json)
//                               (both `<workflow> <command>` and
//                               `<command> <workflow>` argument orders work)
//   <workflow> transition <event>
//                               advance; illegal events are rejected
//   <workflow> reset            restart at the entry point
//   <workflow> history          print the persisted event history
//
// Guards (research basis: Stately/XState agent semantics - "the machine defines
// what the agent can do; the model only ever picks a legal event"). A guard is
// a transition predicate, NOT a prompt instruction: it is declared per state as
// `guards: {EVENT: "<expression>"}`, mirroring the shape of `transitions:
// {EVENT: target}` and keyed by the leaving event, so the guard sits exactly
// where the event leaves the state. Expressions are evaluated by the machine
// against the persisted workflow context with a small safe interpreter (no
// eval/Function). Grammar: ==, !=, >=, <=, >, <, &&, ||, !, parentheses,
// string/number/bool literals, dotted context paths (review.passCount) and
// len(array) >= n. An event whose guard does not hold is rejected with the
// structured result {ok:false, reason:"rejected-by-guard", event,
// legalEvents:[...], guard:"<expression>"}, the rejection is recorded in the
// state history (event `rejected-by-guard`, together with the remaining legal
// move set), and the legal alternatives are re-offered to the caller.
// Guards are pure functions of (state, context): same state + same context =>
// same decision. No clock, randomness, or I/O enters the decision, so the
// persisted snapshot plus the event log replays to identical decisions
// (replay stability). Unresolved context paths fail closed (event rejected).
// When no guard is declared for an event, behavior is exactly as before.
//
// Idempotency (research basis: Temporal - "write intent before executing the
// effect", effect sandwich record claim -> execute -> commit outcome;
// LangGraph HITL - resume re-executes the whole node from its start, so side
// effects before an interrupt must be safe to re-run): mutating skills pair
// this machine with platform/idempotency.mjs.
//
// `transition` exit codes: 0 ok, 1 invalid event or max-iteration escalation,
// 2 rejected-by-guard.
//
// Test isolation: WORKFLOW_STATE_MACHINE_STATE_DIR and
// WORKFLOW_STATE_MACHINE_WORKFLOWS_DIR override the state and workflow
// directories (defaults: platform/state and platform/workflows). The ambient
// repository state directory is never written by tests.
import { readFileSync, writeFileSync, mkdirSync, realpathSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WORKFLOWS_DIR = process.env.WORKFLOW_STATE_MACHINE_WORKFLOWS_DIR
  ? resolve(process.env.WORKFLOW_STATE_MACHINE_WORKFLOWS_DIR)
  : join(__dirname, 'workflows')
const STATE_DIR = process.env.WORKFLOW_STATE_MACHINE_STATE_DIR
  ? resolve(process.env.WORKFLOW_STATE_MACHINE_STATE_DIR)
  : join(__dirname, 'state')

function parseScalar(str) {
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1)
  }
  if (str === 'true') return true
  if (str === 'false') return false
  const num = Number(str)
  if (!Number.isNaN(num) && str.trim() !== '') return num
  return str
}

function parseYaml(text) {
  const lines = text.split('\n')
  const root = {}
  const path = [{ container: root, indent: -1 }]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith('#')) continue

    const indent = line.search(/\S/)
    const trimmed = line.trim()

    if (trimmed.startsWith('- ')) {
      const value = parseScalar(trimmed.slice(2))
      for (let j = path.length - 1; j >= 0; j--) {
        if (Array.isArray(path[j].container)) {
          path[j].container.push(value)
          break
        }
      }
      continue
    }

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim()
    const valueStr = trimmed.slice(colonIdx + 1).trim()

    while (path.length > 1 && indent <= path[path.length - 1].indent) {
      path.pop()
    }

    const current = path[path.length - 1].container

    if (valueStr === '') {
      let lookahead = i + 1
      while (lookahead < lines.length && (!lines[lookahead].trim() || lines[lookahead].trim().startsWith('#'))) {
        lookahead++
      }
      if (lookahead < lines.length) {
        const nextLine = lines[lookahead]
        const nextIndent = nextLine.search(/\S/)
        const nextTrimmed = nextLine.trim()
        if (nextIndent > indent) {
          if (nextTrimmed.startsWith('- ')) {
            const list = []
            current[key] = list
            path.push({ container: list, indent })
          } else if (nextTrimmed.includes(':')) {
            const dict = {}
            current[key] = dict
            path.push({ container: dict, indent })
          } else {
            current[key] = ''
          }
          continue
        }
      }
      const dict = {}
      current[key] = dict
      path.push({ container: dict, indent })
    } else if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
      const items = valueStr.slice(1, -1).split(',').map(s => parseScalar(s.trim()))
      current[key] = items
    } else {
      current[key] = parseScalar(valueStr)
    }
  }

  return root
}

function loadWorkflow(name) {
  const path = join(WORKFLOWS_DIR, name + '.yaml')
  const text = readFileSync(path, 'utf-8')
  return parseYaml(text)
}

// ---------------------------------------------------------------------------
// Guard expression interpreter
//
// Deliberately small recursive-descent parser over a token list - no eval and
// no Function, so a guard expression can never execute arbitrary code. Guards
// are pure: evaluation reads only the context argument, so the same (state,
// context) always yields the same decision and the persisted snapshot plus
// event log replays identically (replay stability).
//
//   expr        := or
//   or          := and ( '||' and )*
//   and         := not ( '&&' not )*
//   not         := '!' not | comparison
//   comparison  := primary ( ('=='|'!='|'>='|'<='|'>'|'<') primary )?
//   primary     := '(' expr ')' | literal | contextPath | 'len' '(' contextPath ')'
//
// Unresolved context paths evaluate to undefined, so a guard over missing
// context fails closed (the event is rejected); an unparseable expression also
// fails closed rather than silently opening a transition.
// ---------------------------------------------------------------------------

const COMPARISON_OPS = ['==', '!=', '>=', '<=', '>', '<']

function tokenizeGuard(expression) {
  const tokens = []
  let i = 0
  while (i < expression.length) {
    const ch = expression[i]
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i++
      continue
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1
      let value = ''
      while (j < expression.length && expression[j] !== ch) {
        value += expression[j]
        j++
      }
      if (expression[j] !== ch) throw new Error('unterminated string literal')
      tokens.push({ type: 'string', value })
      i = j + 1
      continue
    }
    const twoChar = expression.slice(i, i + 2)
    if (['==', '!=', '>=', '<=', '&&', '||'].includes(twoChar)) {
      tokens.push({ type: 'op', value: twoChar })
      i += 2
      continue
    }
    if (['>', '<', '!', '(', ')'].includes(ch)) {
      tokens.push({ type: 'op', value: ch })
      i++
      continue
    }
    const next = expression[i + 1]
    if ((ch >= '0' && ch <= '9') || (ch === '-' && next !== undefined && next >= '0' && next <= '9')) {
      let j = i + (ch === '-' ? 1 : 0)
      while (j < expression.length && expression[j] >= '0' && expression[j] <= '9') j++
      if (expression[j] === '.') {
        j++
        while (j < expression.length && expression[j] >= '0' && expression[j] <= '9') j++
      }
      tokens.push({ type: 'number', value: Number(expression.slice(i, j)) })
      i = j
      continue
    }
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i
      while (j < expression.length && /[A-Za-z0-9_$.]/.test(expression[j])) j++
      tokens.push({ type: 'ident', value: expression.slice(i, j) })
      i = j
      continue
    }
    throw new Error('unexpected character: ' + ch)
  }
  return tokens
}

function resolveContextPath(path, context) {
  let value = context
  for (const part of path.split('.')) {
    if (value === null || value === undefined || typeof value !== 'object') return undefined
    value = value[part]
  }
  return value
}

function compareValues(left, op, right) {
  switch (op) {
    case '==': return left === right
    case '!=': return left !== right
    case '>': return left > right
    case '<': return left < right
    case '>=': return left >= right
    case '<=': return left <= right
    default: throw new Error('unknown comparison operator: ' + op)
  }
}

function createGuardParser(tokens, context) {
  let pos = 0
  const peek = () => tokens[pos]
  const advance = () => tokens[pos++]

  function parseExpression() {
    return parseOr()
  }

  function parseOr() {
    let left = parseAnd()
    while (peek() && peek().type === 'op' && peek().value === '||') {
      advance()
      const right = parseAnd()
      left = left || right
    }
    return left
  }

  function parseAnd() {
    let left = parseNot()
    while (peek() && peek().type === 'op' && peek().value === '&&') {
      advance()
      const right = parseNot()
      left = left && right
    }
    return left
  }

  function parseNot() {
    if (peek() && peek().type === 'op' && peek().value === '!') {
      advance()
      return !parseNot()
    }
    return parseComparison()
  }

  function parseComparison() {
    const left = parsePrimary()
    if (peek() && peek().type === 'op' && COMPARISON_OPS.includes(peek().value)) {
      const op = advance().value
      const right = parsePrimary()
      return compareValues(left, op, right)
    }
    return left
  }

  function parsePrimary() {
    const token = advance()
    if (!token) throw new Error('unexpected end of guard expression')
    if (token.type === 'op' && token.value === '(') {
      const value = parseExpression()
      const close = advance()
      if (!close || close.type !== 'op' || close.value !== ')') throw new Error('expected )')
      return value
    }
    if (token.type === 'op' && token.value === ')') throw new Error('unexpected )')
    if (token.type === 'string' || token.type === 'number') return token.value
    if (token.type === 'ident') {
      if (token.value === 'true') return true
      if (token.value === 'false') return false
      if (token.value === 'null') return null
      if (token.value === 'len') {
        const open = advance()
        if (!open || open.type !== 'op' || open.value !== '(') throw new Error('len expects (contextPath)')
        const pathToken = advance()
        if (!pathToken || pathToken.type !== 'ident') throw new Error('len expects a context path')
        const close = advance()
        if (!close || close.type !== 'op' || close.value !== ')') throw new Error('expected ) after len(contextPath)')
        const value = resolveContextPath(pathToken.value, context)
        if (!Array.isArray(value)) throw new Error('len() expects an array context path')
        return value.length
      }
      return resolveContextPath(token.value, context)
    }
    throw new Error('unexpected token in guard expression')
  }

  return {
    parseExpression,
    atEnd: () => pos >= tokens.length
  }
}

// Evaluate a guard expression against a workflow context. Returns a boolean;
// any malformed expression or missing context path fails closed to false.
function evaluateGuard(expression, context) {
  if (typeof expression !== 'string' || expression.trim() === '') return true
  try {
    const tokens = tokenizeGuard(expression)
    if (tokens.length === 0) return true
    const parser = createGuardParser(tokens, context || {})
    const value = parser.parseExpression()
    if (!parser.atEnd()) throw new Error('trailing tokens in guard expression')
    return Boolean(value)
  } catch {
    return false
  }
}

// Merge the YAML context defaults under the persisted context: values already
// present in the snapshot win, missing keys (including nested ones) are filled
// from the declared defaults. Defaults are cloned so the workflow definition
// object is never mutated by runtime state.
function mergeContext(defaults, current) {
  const merged = { ...current }
  for (const [key, value] of Object.entries(defaults || {})) {
    if (merged[key] === undefined) {
      merged[key] = value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value
    } else if (
      value && typeof value === 'object' && !Array.isArray(value) &&
      merged[key] && typeof merged[key] === 'object' && !Array.isArray(merged[key])
    ) {
      merged[key] = mergeContext(value, merged[key])
    }
  }
  return merged
}

// The context a guard sees: persisted context merged over YAML defaults.
function effectiveContext(workflow, state) {
  return mergeContext(workflow.context || {}, (state && state.context) || {})
}

// Events legal from the current state after guard evaluation. An event with no
// declared guard is always legal (backward compatible). Blocked events are
// reported with their guard expression so the caller can re-offer the legal
// move set with reasons.
function computeLegalEvents(workflow, state) {
  const current = getCurrentState(workflow, state)
  const transitions = getAvailableTransitions(workflow, current)
  const guards = (workflow.states[current] && workflow.states[current].guards) || {}
  const context = effectiveContext(workflow, state)
  const legalEvents = []
  const blockedEvents = []
  for (const [event, target] of Object.entries(transitions)) {
    const guard = guards[event]
    if (guard === undefined || evaluateGuard(guard, context)) {
      legalEvents.push(event)
    } else {
      blockedEvents.push({ event, target, guard })
    }
  }
  return { legalEvents, blockedEvents }
}

function loadState(name) {
  const path = join(STATE_DIR, name + '.json')
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return null
  }
}

function saveState(state) {
  writeFileSync(join(STATE_DIR, state.workflow + '.json'), JSON.stringify(state, null, 2))
}

function now() {
  return new Date().toISOString()
}

function getCurrentState(workflow, state) {
  if (!state || !state.history || state.history.length === 0) {
    return workflow.entryPoint
  }
  return state.currentState
}

function getAvailableTransitions(workflow, stateName) {
  const stateDef = workflow.states[stateName]
  if (!stateDef) return {}
  return stateDef.transitions || {}
}

function formatState(state, workflow, json) {
  const current = getCurrentState(workflow, state)
  const transitions = getAvailableTransitions(workflow, current)
  const stateDef = workflow.states[current] || {}
  const result = {
    workflow: workflow.name,
    version: workflow.version,
    currentState: current,
    stateType: stateDef.type || null,
    description: stateDef.description || null,
    availableTransitions: Object.keys(transitions),
    transitionMap: transitions,
    maxIterations: stateDef.maxIterations || null,
    context: state?.context || {}
  }
  if (json) {
    return JSON.stringify(result, null, 2)
  }
  let out = 'Workflow: ' + workflow.name + ' (v' + workflow.version + ')\n'
  out += 'Current State: ' + current + ' (' + (stateDef.type || 'unknown') + ')\n'
  out += 'Description: ' + (stateDef.description || 'N/A') + '\n'
  if (stateDef.maxIterations) {
    out += 'Max Iterations: ' + stateDef.maxIterations + '\n'
    const loopIterations = (state?.context?.loopIterations) || 0
    out += 'Current Iterations: ' + loopIterations + '\n'
  }
  out += '\nAvailable Transitions:\n'
  for (const [event, target] of Object.entries(transitions)) {
    out += '  ' + event + ' => ' + target + '\n'
  }
  if (Object.keys(state?.context || {}).length > 0) {
    out += '\nContext:\n'
    for (const [k, v] of Object.entries(state.context)) {
      out += '  ' + k + ': ' + v + '\n'
    }
  }
  return out
}

function formatHistory(state, workflow, json) {
  if (json) {
    return JSON.stringify(state.history || [], null, 2)
  }
  let out = 'Workflow: ' + workflow.name + '\n'
  out += 'Version: ' + workflow.version + '\n'
  out += 'History:\n'
  for (const entry of (state.history || [])) {
    const eventStr = entry.event ? ' [' + entry.event + ']' : ''
    out += '  ' + entry.state + ' at ' + entry.enteredAt + eventStr + '\n'
  }
  return out
}

function ensureStateDir() {
  mkdirSync(STATE_DIR, { recursive: true })
}

function transitionState(workflow, state, event) {
  const current = getCurrentState(workflow, state)
  const stateDef = workflow.states[current]
  if (!stateDef) {
    return { error: 'Unknown state: ' + current, exitCode: 1 }
  }

  const transitions = stateDef.transitions || {}
  const target = transitions[event]
  if (!target) {
    return { error: 'Invalid event \'' + event + '\' for state \'' + current + '\'. Available: ' + Object.keys(transitions).join(', '), exitCode: 1 }
  }

  // Guard gate (Stately/XState: the machine defines what the agent can do;
  // the model only ever picks a legal event). The guard is evaluated against
  // the persisted context and rejects the event BEFORE any loop counter or
  // escalation runs, so a blocked re-entry surfaces as rejected-by-guard with
  // the remaining legal move set instead of an opaque counter surprise.
  // Guards are pure: same state + same context => same decision.
  const guard = (stateDef.guards || {})[event]
  if (guard !== undefined && !evaluateGuard(guard, effectiveContext(workflow, state))) {
    const { legalEvents } = computeLegalEvents(workflow, state)
    state.history.push({
      state: current,
      enteredAt: now(),
      event: 'rejected-by-guard',
      rejectedEvent: event,
      guard: guard,
      legalEvents: legalEvents
    })
    saveState(state)
    return {
      ok: false,
      reason: 'rejected-by-guard',
      event: event,
      guard: guard,
      legalEvents: legalEvents,
      state: state,
      exitCode: 2
    }
  }

  if (stateDef.loop) {
    const iterations = (state?.context?.loopIterations || 0) + 1
    state.context = state.context || {}
    state.context.loopIterations = iterations
  }

  if (stateDef.maxIterations) {
    const iterations = (state?.context?.loopIterations || 0)
    if (iterations >= stateDef.maxIterations) {
      state.currentState = 'escalate'
      state.history.push({
        state: 'escalate',
        enteredAt: now(),
        event: event
      })
      saveState(state)
      return { error: 'Max iterations (' + stateDef.maxIterations + ') exceeded for state \'' + current + '\'. Escalated.', exitCode: 1, state }
    }
  }

  state.currentState = target
  state.history.push({
    state: target,
    enteredAt: now(),
    event: event
  })
  saveState(state)
  return { state, exitCode: 0 }
}

function resetState(workflow) {
  ensureStateDir()
  const state = {
    workflow: workflow.name,
    version: workflow.version,
    currentState: workflow.entryPoint,
    history: [
      {
        state: workflow.entryPoint,
        enteredAt: now(),
        event: null
      }
    ],
    context: {}
  }
  saveState(state)
  return state
}

// Seed missing context keys from the YAML defaults so guards evaluate against a
// complete, replay-stable context even for snapshots written before the
// workflow declared defaults. Called on load; the merge is idempotent.
function withContextDefaults(workflow, state) {
  if (!state) return state
  state.context = effectiveContext(workflow, state)
  return state
}

function main() {
  ensureStateDir()
  const args = process.argv.slice(2)
  const jsonIndex = args.indexOf('--json')
  const json = jsonIndex !== -1
  if (json) args.splice(jsonIndex, 1)

  if (args.length < 2) {
    console.error('Usage: workflow-state-machine.mjs <workflow-name> <command> [args]')
    process.exit(1)
  }

  // Commands are canonically `<workflow> <command>` (unchanged); the swapped
  // form `<command> <workflow>` is also accepted for convenience.
  const COMMANDS = ['current', 'legal-events', 'transition', 'reset', 'history']
  let workflowName = args[0]
  let command = args[1]
  let rest = args.slice(2)
  if (COMMANDS.includes(workflowName) && !COMMANDS.includes(command)) {
    const swapped = workflowName
    workflowName = command
    command = swapped
  }
  let workflow, state

  try {
    workflow = loadWorkflow(workflowName)
  } catch {
    console.error('Workflow not found: ' + workflowName)
    process.exit(1)
  }

  state = loadState(workflowName)
  state = withContextDefaults(workflow, state)

  switch (command) {
    case 'current':
      if (!state) {
        console.error('No state found for workflow: ' + workflowName + '. Run reset first.')
        process.exit(1)
      }
      console.log(formatState(state, workflow, json))
      break
    case 'legal-events': {
      // Events legal from the current state after guard evaluation. Works
      // with or without a persisted snapshot (entry point + YAML defaults).
      const { legalEvents, blockedEvents } = computeLegalEvents(workflow, state)
      if (json) {
        console.log(JSON.stringify({
          workflow: workflow.name,
          currentState: getCurrentState(workflow, state),
          legalEvents: legalEvents,
          blockedEvents: blockedEvents
        }, null, 2))
      } else {
        console.log('Workflow: ' + workflow.name + ' (v' + workflow.version + ')')
        console.log('Current State: ' + getCurrentState(workflow, state))
        console.log('Legal events (after guards):')
        if (legalEvents.length === 0) {
          console.log('  (none)')
        } else {
          const transitions = getAvailableTransitions(workflow, getCurrentState(workflow, state))
          for (const event of legalEvents) {
            console.log('  ' + event + ' => ' + (transitions[event] || '?'))
          }
        }
        if (blockedEvents.length > 0) {
          console.log('Blocked by guards:')
          for (const blocked of blockedEvents) {
            console.log('  ' + blocked.event + ' => ' + blocked.target + ' [guard: ' + blocked.guard + ']')
          }
        }
      }
      break
    }
    case 'transition':
      if (!state) {
        console.error('No state found for workflow: ' + workflowName + '. Run reset first.')
        process.exit(1)
      }
      if (rest.length === 0) {
        console.error('Usage: transition <event>')
        process.exit(1)
      }
      const event = rest[0]
      const result = transitionState(workflow, state, event)
      if (result.reason === 'rejected-by-guard') {
        // Structured rejection (Stately: re-offer the legal move set). The
        // rejection is already recorded in the persisted state history.
        if (json) {
          console.log(JSON.stringify({
            ok: false,
            reason: 'rejected-by-guard',
            event: result.event,
            legalEvents: result.legalEvents,
            guard: result.guard
          }, null, 2))
        } else {
          console.error('Rejected by guard: ' + event + ' blocked by [' + result.guard + '] in state ' + state.currentState + '.')
          console.error('Legal events: ' + (result.legalEvents.join(', ') || 'none'))
        }
        process.exit(2)
      }
      if (result.error) {
        console.error(result.error)
        process.exit(result.exitCode)
      }
      state = result.state
      const newTransitions = getAvailableTransitions(workflow, state.currentState)
      if (json) {
        const out = {
          previous: state.history[state.history.length - 2]?.state || null,
          current: state.currentState,
          event: event,
          availableTransitions: Object.keys(newTransitions),
          legalEvents: computeLegalEvents(workflow, state).legalEvents
        }
        console.log(JSON.stringify(out, null, 2))
      } else {
        console.log('Transitioned to: ' + state.currentState)
        console.log('Available transitions: ' + (Object.keys(newTransitions).join(', ') || 'none (terminal)'))
      }
      break
    case 'reset':
      state = resetState(workflow)
      if (json) {
        console.log(JSON.stringify(state, null, 2))
      } else {
        console.log('Reset ' + workflowName + ' to ' + workflow.entryPoint)
      }
      break
    case 'history':
      if (!state) {
        console.error('No state found for workflow: ' + workflowName + '. Run reset first.')
        process.exit(1)
      }
      console.log(formatHistory(state, workflow, json))
      break
    default:
      console.error('Unknown command: ' + command)
      process.exit(1)
  }
}

// Run as a CLI only when executed directly; importing the module (tests)
// exposes the pure helpers below without side effects.
function isDirectRun() {
  try {
    const entry = process.argv[1]
    if (!entry) return false
    return realpathSync(entry) === fileURLToPath(import.meta.url)
  } catch {
    return false
  }
}

if (isDirectRun()) {
  main()
}

export {
  parseYaml,
  loadWorkflow,
  evaluateGuard,
  computeLegalEvents,
  transitionState,
  mergeContext,
  tokenizeGuard
}
