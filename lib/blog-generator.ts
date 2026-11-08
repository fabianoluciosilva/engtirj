import type { BlogTopic } from './blog-topics'
import { site } from './site'

/**
 * Geração de artigos do blog.
 *
 * `generateArticle` produz o Markdown do artigo. Quando há DEEPSEEK_API_KEY
 * configurada, usa a API do DeepSeek; caso contrário (ou em falha), recorre a
 * um template técnico determinístico — assim o cron nunca quebra e o blog
 * continua sendo alimentado mesmo sem IA no ambiente.
 */

export interface GeneratedArticle {
  content_md: string
  source: 'deepseek' | 'fallback'
}

const SYSTEM_PROMPT =
  'Você é um engenheiro de infraestrutura de TI especializado em empresas de engenharia, ' +
  'arquitetura e construção civil. Escreve artigos técnicos em português do Brasil, ' +
  'diretos, práticos e sem enrolação, com foco em resolver a dor do leitor. ' +
  'O público são diretores e sócios de escritórios de engenharia no Rio de Janeiro.'

function userPrompt(topic: BlogTopic): string {
  return [
    `Escreva um artigo de blog em Markdown sobre: "${topic.title}".`,
    `Categoria: ${topic.category}.`,
    `Ângulo técnico: ${topic.angle}`,
    '',
    'REGRAS DO ARTIGO:',
    '- Comece com um parágrafo de "resposta direta" (o primeiro parágrafo deve responder objetivamente à pergunta do título em 1-2 frases), para otimizar GEO (Perplexity, ChatGPT, Gemini).',
    '- Use H2 (##) para seções e H3 (###) quando necessário.',
    '- Inclua ao menos uma lista com marcadores com passos concretos.',
    '- Mencione o recorte regional (Rio de Janeiro / RJ) de forma natural.',
    '- Tom técnico, confiável, sem jargão vazio e sem promessas exageradas.',
    '- Tamanho entre 700 e 1200 palavras.',
    '- NÃO inclua o título como H1 (o título já é renderizado pela página). Comece direto no conteúdo.',
    '- NÃO invente números de telefone ou e-mails; a marca é a EngTI RJ.',
    '- Finalize com um H2 "## Próximos passos" convidando a agendar um diagnóstico de TI.',
  ].join('\n')
}

/** Chama a API do DeepSeek (compatível com o formato OpenAI Chat). */
async function generateWithDeepSeek(topic: BlogTopic): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt(topic) },
        ],
        temperature: 0.7,
        max_tokens: 2600,
      }),
    })

    if (!res.ok) {
      console.error('[blog-generator] DeepSeek HTTP', res.status)
      return null
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = json.choices?.[0]?.message?.content?.trim()
    return content && content.length > 200 ? content : null
  } catch (error) {
    console.error('[blog-generator] DeepSeek erro', error)
    return null
  }
}

/** Template determinístico — usado quando não há IA disponível. */
function generateFallback(topic: BlogTopic): string {
  return `Este artigo responde de forma direta: ${topic.metaDescription}

## O problema

Escritórios de engenharia, arquitetura e construção civil no Rio de Janeiro lidam diariamente com projetos pesados e arquivos críticos. ${topic.angle}
A infraestrutura genérica não foi pensada para o volume e a concorrência de acesso de um escritório técnico — e é aí que nascem os gargalos.

## O que resolve

- Diagnosticar o gargalo real antes de investir (disco, rede, protocolo ou estação).
- Dimensionar servidor e storage para leitura/escrita intensiva.
- Segmentar a rede e priorizar o tráfego de arquivos de projeto.
- Garantir backup com cópia imutável e offsite.

## O que a EngTI RJ faz

A ${site.name} atende exclusivamente empresas de engenharia, arquitetura e construção civil no estado do Rio de Janeiro, com infraestrutura sob medida para projetos CAD/BIM, redes para canteiros de obras, backup contra ransomware e gestão de licenciamento de softwares técnicos.

## Próximos passos

Agende um diagnóstico gratuito da infraestrutura da sua empresa de engenharia. Nossa equipe identifica os gargalos e propõe um plano técnico objetivo, sem enrolação.

> Conteúdo em atualização: este artigo é gerado automaticamente e será complementado com o detalhamento técnico completo.`
}

export async function generateArticle(topic: BlogTopic): Promise<GeneratedArticle> {
  const ai = await generateWithDeepSeek(topic)
  if (ai) return { content_md: ai, source: 'deepseek' }
  return { content_md: generateFallback(topic), source: 'fallback' }
}

