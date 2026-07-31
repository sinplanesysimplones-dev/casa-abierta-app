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

interface VercelRequest {
  method?: string
  body?: ClassificationRequest
  query?: Record<string, string>
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (data: any) => void
}

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

const MOCK_ARCHETYPES = {
  'Búho': {
    resumen_ikigai: 'Tu pasión por entender se convierte en tu misión: analizar y resolver lo que otros no ven.',
    ideas: ['Consultoría en análisis de datos', 'Auditoría y validación de procesos', 'Investigación y desarrollo'],
    arquetipo: 'Búho',
    frase_sticker: 'Ves patrones donde otros ven caos'
  },
  'Zorro': {
    resumen_ikigai: 'Conectas personas, historias e ideas para crear puentes entre mundos diferentes.',
    ideas: ['Negociación y mediación', 'Comunicación corporativa', 'Ventas y relaciones estratégicas'],
    arquetipo: 'Zorro',
    frase_sticker: 'Abres puertas que otros ni ven'
  },
  'Guepardo': {
    resumen_ikigai: 'Tu velocidad y precisión transforman visiones en resultados concretos y medibles.',
    ideas: ['Gestión de proyectos de alto impacto', 'Emprendimiento y escalado', 'Operaciones de alto rendimiento'],
    arquetipo: 'Guepardo',
    frase_sticker: 'Llevas a cabo lo que otros imaginan'
  },
  'Abeja': {
    resumen_ikigai: 'Transformas ideas en creaciones únicas que inspiran y generan valor genuino.',
    ideas: ['Diseño y creatividad estratégica', 'Desarrollo de productos innovadores', 'Branding y experiencia'],
    arquetipo: 'Abeja',
    frase_sticker: 'Haces realidad lo que antes no existía'
  },
  'Tortuga': {
    resumen_ikigai: 'Tu atención al detalle y consistencia garantiza que todo sea duradero y bien hecho.',
    ideas: ['Control de calidad y excelencia', 'Gestión de operaciones estables', 'Mentoría y desarrollo de equipos'],
    arquetipo: 'Tortuga',
    frase_sticker: 'Tu consistencia construye imperios'
  }
}

function detectArchetype(love: string, good: string, needed: string, paid: string): string {
  const text = `${love} ${good} ${needed} ${paid}`.toLowerCase()

  const arquetipos = {
    'Búho': ['analizar', 'entender', 'investigar', 'resolver', 'detectar', 'problema', 'errores', 'datos', 'lógica', 'estrategia', 'complejidad', 'ideas'],
    'Zorro': ['comunicar', 'conectar', 'gente', 'personas', 'vender', 'negociar', 'relación', 'red', 'ayudar', 'dialogar', 'influencia'],
    'Guepardo': ['hacer', 'construir', 'actuar', 'rápido', 'ejecutar', 'lograr', 'resultados', 'presión', 'decidir', 'acción', 'velocidad'],
    'Abeja': ['crear', 'diseñar', 'imaginar', 'innovar', 'original', 'distinto', 'arte', 'música', 'estética', 'visión', 'nuevas'],
    'Tortuga': ['cuidar', 'organizar', 'perfeccionar', 'consistencia', 'detalle', 'calidad', 'bien', 'orden', 'precisión', 'equilibrio', 'estable']
  }

  const scores = {} as Record<string, number>
  for (const [arch, keywords] of Object.entries(arquetipos)) {
    scores[arch] = keywords.filter(kw => text.includes(kw)).length
  }

  return Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0]
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  console.log('Handler called with method:', req.method)

  // Solo POST
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Validar API key en servidor
  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) {
    console.log('API key not found in environment')
    res.status(500).json({ error: 'API key no configurada en servidor' })
    return
  }
  console.log('API key found in environment')

  try {
    const { love, good, needed, paid } = req.body as ClassificationRequest

    // Validar que todas las respuestas estén presentes
    if (!love || !good || !needed || !paid) {
      res.status(400).json({ error: 'Faltan respuestas requeridas' })
      return
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
      res.status(response.status).json({ error: error.message })
      return
    }

    const data = await response.json()
    const content = data.content[0].text

    // Parsear el JSON de respuesta
    const result: ClassificationResponse = JSON.parse(content)

    res.status(200).json(result)
    return
  } catch (error) {
    console.error('Error clasificando:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' })
    return
  }
}
