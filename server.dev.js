const http = require('http')

// Mock del endpoint para desarrollo
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (req.url === '/api/clasificar' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      try {
        const apiKey = process.env.CLAUDE_API_KEY
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'API key no configurada' }))
          return
        }

        const { love, good, needed, paid } = JSON.parse(body)

        // Llamar a Claude API
        const systemPrompt = `Eres un analista de talento que aplica el marco Ikigai (pasión, vocación, profesión, misión).

Clasifica el arquetipo entre: Búho (Estratega), Zorro (Conector), Guepardo (Ejecutor), Abeja (Creativa), Tortuga (Cuidadosa).

Responde SOLO con JSON (sin markdown ni backticks):
{
  "resumen_ikigai": "Frase corta conectando sus 4 respuestas (máx 20 palabras)",
  "ideas": ["idea 1", "idea 2", "idea 3"],
  "arquetipo": "Búho" | "Zorro" | "Guepardo" | "Abeja" | "Tortuga",
  "frase_sticker": "Frase mantra corta (máx 12 palabras)"
}`

        const userPrompt = `- Lo que AMO: ${love}
- En lo que soy BUENO: ${good}
- Lo que el MUNDO NECESITA: ${needed}
- Por lo que me pueden PAGAR: ${paid}`

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
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
          })
        })

        const data = await response.json()

        if (!response.ok) {
          res.writeHead(response.status, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: data.error?.message || 'Error en Claude API' }))
          return
        }

        const content = data.content[0].text
        const result = JSON.parse(content)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (error) {
        console.error('Error:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: error.message }))
      }
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

const PORT = 3001
server.listen(PORT, () => {
  console.log(`Backend dev server corriendo en http://localhost:${PORT}`)
})
