import type { IncomingMessage, ServerResponse } from 'http'

interface ClassificationRequest {
  love: string
  good: string
  needed: string
  paid: string
}

interface ClassificationResponse {
  resumen_ikigai: string
  ideas: string[]
  arquetipo: string
  frase_sticker: string
}

type VercelRequest = IncomingMessage & { body?: any; query?: any }
type VercelResponse = ServerResponse & { status?: (code: number) => VercelResponse; json?: (data: any) => void }

const SYSTEM_PROMPT = `Eres un analista de talento que aplica el marco Ikigai (pasión, vocación, profesión, misión) para dar orientación profesional rápida y honesta.

Recibirás las respuestas de una persona a 4 preguntas:
1. Lo que AMA: {respuesta_1}
2. En lo que es BUENO: {respuesta_2}
3. Lo que el MUNDO NECESITA de ella: {respuesta_3}
4. Por lo que le PAGARÍAN: {respuesta_4}

Clasifica su arquetipo entre estas 5 opciones, usando estos criterios y ejemplos de referencia:

- Búho (Estratega): respuestas giran en torno a entender, investigar, analizar, resolver problemas complejos, planear. Ej: "detectar errores que otros no ven", "me buscan cuando algo no cuadra".
- Zorro (Conector): respuestas giran en torno a ayudar personas, comunicar, conectar gente, vender, negociar. Ej: "hablar con gente nueva", "me buscan para negociar o presentar".
- Guepardo (Ejecutor): respuestas giran en torno a hacer, construir, lograr resultados rápido, actuar bajo presión. Ej: "decidir rápido", "me buscan cuando algo urge".
- Abeja (Creativa): respuestas giran en torno a crear, diseñar, imaginar, innovar, construir desde cero. Ej: "diseñar logos", "me buscan para algo original o distinto".
- Tortuga (Cuidadosa): respuestas giran en torno a cuidar, organizar, perfeccionar, dar consistencia. Ej: "no se me escapa nada", "me buscan para que algo salga bien hecho".

Genera un JSON con esta estructura exacta, sin texto adicional antes o después:

{
  "resumen_ikigai": "Frase corta (máx 20 palabras) conectando sus 4 respuestas, usando el lenguaje del diagrama Ikigai (pasión, vocación, profesión, misión)",
  "ideas": ["idea concreta 1", "idea concreta 2", "idea concreta 3"],
  "arquetipo": "Búho" | "Zorro" | "Guepardo" | "Abeja" | "Tortuga",
  "frase_sticker": "Frase mantra corta (máx 12 palabras) para imprimir en un sticker, resumiendo su fuerza principal"
}

Sé cálido pero directo. No uses frases genéricas tipo "puedes lograr lo que te propongas" — sé específico basado en lo que la persona realmente dijo. Responde SOLO con el JSON, sin markdown, sin backticks, sin texto adicional.`

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validar API key en servidor
  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada en servidor' })
  }

  try {
    const { love, good, needed, paid } = req.body as ClassificationRequest

    // Validar que todas las respuestas estén presentes
    if (!love || !good || !needed || !paid) {
      return res.status(400).json({ error: 'Faltan respuestas requeridas' })
    }

    // Crear el prompt con las respuestas
    const userPrompt = `Respuestas Ikigai:
- Lo que AMO: ${love}
- En lo que soy BUENO: ${good}
- Lo que el MUNDO NECESITA: ${needed}
- Por lo que me pueden PAGAR: ${paid}`

    // Llamar a Claude API desde el servidor
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return res.status(response.status).json({ error: error.message })
    }

    const data = await response.json()
    const content = data.content[0].text

    // Parsear el JSON de respuesta
    const result: ClassificationResponse = JSON.parse(content)

    return res.status(200).json(result)
  } catch (error) {
    console.error('Error clasificando:', error)
    return res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'Error desconocido' })
  }
}
