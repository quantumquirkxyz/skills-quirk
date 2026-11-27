// Draft-07/2020-12 compatible validator for local JSON artifacts.
export function validateJson(schema, value, options = {}) {
  const errors = [];
  const root = options.rootSchema ?? schema;
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const type = (v) => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v;
  const matches = (v, expected) => (Array.isArray(expected) ? expected : [expected]).some((t) => t === 'number' ? typeof v === 'number' && Number.isFinite(v) : type(v) === t);
  const resolve = (node) => {
    if (!node?.$ref || !node.$ref.startsWith('#/')) return node;
    return node.$ref.slice(2).split('/').reduce((current, part) => current?.[part.replaceAll('~1', '/').replaceAll('~0', '~')], root);
  };
  const dateTime = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(v) && !Number.isNaN(Date.parse(v));
  const visit = (raw, instance, pointer) => {
    const s = resolve(raw);
    if (s === true || s == null) return;
    if (s === false) { errors.push(`${pointer}: schema is false`); return; }
    if (s.allOf) s.allOf.forEach((x) => visit(x, instance, pointer));
    for (const keyword of ['anyOf', 'oneOf']) if (s[keyword]) {
      const results = s[keyword].map((x) => { const before = errors.length; visit(x, instance, pointer); const ok = errors.length === before; errors.splice(before); return ok; });
      const count = results.filter(Boolean).length;
      if ((keyword === 'anyOf' && count === 0) || (keyword === 'oneOf' && count !== 1)) errors.push(`${pointer}: ${keyword} branch requirement failed`);
    }
    if (s.not) { const before = errors.length; visit(s.not, instance, pointer); const matched = errors.length === before; errors.splice(before); if (matched) errors.push(`${pointer}: must not match not schema`); }
    if (s.if) { const before = errors.length; visit(s.if, instance, pointer); const condition = errors.length === before; errors.splice(before); visit(condition ? s.then : s.else, instance, pointer); }
    if (s.type && !matches(instance, s.type)) { errors.push(`${pointer}: expected ${JSON.stringify(s.type)}, got ${type(instance)}`); return; }
    if (s.const !== undefined && !equal(instance, s.const)) errors.push(`${pointer}: expected const`);
    if (s.enum && !s.enum.some((x) => equal(x, instance))) errors.push(`${pointer}: value is not in enum`);
    if (s.format === 'date-time' && !dateTime(instance)) errors.push(`${pointer}: invalid date-time`);
    if (typeof instance === 'string') { if (s.minLength !== undefined && instance.length < s.minLength) errors.push(`${pointer}: shorter than minLength`); if (s.maxLength !== undefined && instance.length > s.maxLength) errors.push(`${pointer}: longer than maxLength`); if (s.pattern && !new RegExp(s.pattern).test(instance)) errors.push(`${pointer}: does not match pattern`); }
    if (typeof instance === 'number') { if (s.minimum !== undefined && instance < s.minimum) errors.push(`${pointer}: below minimum ${s.minimum}`); if (s.maximum !== undefined && instance > s.maximum) errors.push(`${pointer}: above maximum ${s.maximum}`); if (s.exclusiveMinimum !== undefined && instance <= s.exclusiveMinimum) errors.push(`${pointer}: below exclusiveMinimum ${s.exclusiveMinimum}`); if (s.exclusiveMaximum !== undefined && instance >= s.exclusiveMaximum) errors.push(`${pointer}: above exclusiveMaximum ${s.exclusiveMaximum}`); }
    if (Array.isArray(instance)) { if (s.minItems !== undefined && instance.length < s.minItems) errors.push(`${pointer}: fewer than minItems`); if (s.maxItems !== undefined && instance.length > s.maxItems) errors.push(`${pointer}: more than maxItems`); if (s.uniqueItems && instance.some((x, i) => instance.slice(0, i).some((y) => equal(x, y)))) errors.push(`${pointer}: items are not unique`); if (s.items) instance.forEach((x, i) => visit(s.items, x, `${pointer}/${i}`)); }
    if (instance && typeof instance === 'object' && !Array.isArray(instance)) { for (const key of s.required ?? []) if (!(key in instance)) errors.push(`${pointer}: missing required "${key}"`); const props = s.properties ?? {}; for (const [key, value] of Object.entries(instance)) { if (key in props) visit(props[key], value, `${pointer}/${key}`); else if (s.additionalProperties === false) errors.push(`${pointer}: additional property "${key}" not allowed`); else if (s.additionalProperties && typeof s.additionalProperties === 'object') visit(s.additionalProperties, value, `${pointer}/${key}`); } }
  };
  visit(schema, value, '$');
  return errors;
}
export function assertValid(schema, value, label = 'value') { const errors = validateJson(schema, value); if (errors.length) throw new Error(`${label} failed schema validation: ${errors.join('; ')}`); return value; }
