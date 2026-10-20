import { validateModelResponse } from '../adapter-contract.mjs';

const DEFAULT_TIMEOUT_MS = 120000;

function required(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required`);
  return value;
}

export function createAdapter(config = {}) {
  const endpoint = required(config.endpoint ?? process.env.QUIRK_MODEL_ENDPOINT, 'model endpoint');
  const apiKeyEnv = config.apiKeyEnv ?? 'QUIRK_MODEL_API_KEY';
  const timeoutMs = Math.max(1000, Number(config.timeoutMs ?? DEFAULT_TIMEOUT_MS));
  const protocol = config.protocol ?? 'openai-compatible';

  return {
    name: `http:${protocol}`,
    async complete(request) {
      const key = process.env[apiKeyEnv];
      if (!key) throw new Error(`${apiKeyEnv} is not set; configure the adapter key externally`);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const body = protocol === 'anthropic'
          ? { model: request.model, system: request.system, messages: request.messages, tools: request.tools, max_tokens: request.maxTokens, temperature: request.temperature }
          : { model: request.model, messages: [{ role: 'system', content: request.system }, ...request.messages], tools: (request.tools ?? []).map((tool) => ({ type: 'function', function: { name: tool.name, description: tool.description, parameters: tool.input_schema } })), max_tokens: request.maxTokens, temperature: request.temperature };
        const response = await fetch(endpoint, { method: 'POST', signal: controller.signal, headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` }, body: JSON.stringify(body) });
        if (!response.ok) throw new Error(`model endpoint returned HTTP ${response.status}`);
        const payload = await response.json();
        const message = protocol === 'anthropic' ? (payload.content ?? []) : [payload.choices?.[0]?.message ?? {}];
        const text = protocol === 'anthropic' ? message.filter((item) => item.type === 'text').map((item) => item.text ?? '').join('\n') : (message[0]?.content ?? '');
        const calls = protocol === 'anthropic' ? message.filter((item) => item.type === 'tool_use').map((item) => ({ id: item.id ?? null, name: item.name, input: item.input ?? {} })) : (message[0]?.tool_calls ?? []).map((item) => ({ id: item.id ?? null, name: item.function?.name, input: JSON.parse(item.function?.arguments ?? '{}') }));
        return validateModelResponse({ text, toolCalls: calls, usage: payload.usage ?? null, stopReason: payload.stop_reason ?? payload.choices?.[0]?.finish_reason ?? null, responseModel: payload.model ?? request.model });
      } finally { clearTimeout(timer); }
    },
  };
}

export default { createAdapter };
