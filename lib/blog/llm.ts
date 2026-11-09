/**
 * Cliente mínimo da API do DeepSeek (formato compatível com OpenAI Chat).
 * Sem fallback silencioso: se faltar chave ou a chamada falhar, lança erro —
 * o pipeline registra a falha em vez de publicar texto genérico.
 */
export interface ChatOptions {
  system: string
  user: string
  json?: boolean
  maxTokens?: number
  temperature?: number
  timeoutMs?: number
}

export async function chat({
  system,
  user,
  json = false,
  maxTokens = 4000,
  temperature = 0.6,
  timeoutMs = 100_000,
}: ChatOptions): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY não configurada.')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      }),
    })
    if (!res.ok) throw new Error(`DeepSeek respondeu HTTP ${res.status}.`)

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) throw new Error('DeepSeek devolveu resposta vazia.')
    return content
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('DeepSeek excedeu o tempo limite.')
    throw error
  } finally {
    clearTimeout(timer)
  }
}
