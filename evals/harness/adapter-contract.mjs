/**
 * Provider- and platform-neutral contracts used by evaluation harnesses.
 * Adapters implement these seams; the evaluator must only consume this shape.
 */

export const ADAPTER_CONTRACT_VERSION = '1';

export function validateModelResponse(response) {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    throw new TypeError('model adapter response must be an object');
  }
  if (typeof response.text !== 'string') throw new TypeError('model adapter response.text must be a string');
  if (!Array.isArray(response.toolCalls)) throw new TypeError('model adapter response.toolCalls must be an array');
  for (const call of response.toolCalls) {
    if (!call || typeof call.name !== 'string' || !call.name) throw new TypeError('tool calls require a name');
    if (call.input !== undefined && (call.input === null || typeof call.input !== 'object')) {
      throw new TypeError('tool call input must be an object');
    }
  }
  return response;
}

export function validateModelAdapter(adapter) {
  if (!adapter || typeof adapter !== 'object') throw new TypeError('model adapter must be an object');
  if (typeof adapter.complete !== 'function') throw new TypeError('model adapter must implement complete(request)');
  return adapter;
}

export function validateAgentAdapter(adapter) {
  if (!adapter || typeof adapter !== 'object') throw new TypeError('agent adapter must be an object');
  if (typeof adapter.run !== 'function') throw new TypeError('agent adapter must implement run(request)');
  return adapter;
}

export function validateMcpAdapter(adapter) {
  if (!adapter || typeof adapter !== 'object') throw new TypeError('MCP adapter must be an object');
  if (typeof adapter.callTool !== 'function') throw new TypeError('MCP adapter must implement callTool(request)');
  return adapter;
}
