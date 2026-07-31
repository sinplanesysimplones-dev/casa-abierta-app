export async function POST(request: Request) {
  const formData = await request.formData()
  const audioFile = formData.get('audio') as File

  if (!audioFile) {
    return Response.json(
      { error: 'No audio file provided' },
      { status: 400 }
    )
  }

  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) {
    console.error('Claude API key not found')
    return Response.json(
      { error: 'Transcription service not configured' },
      { status: 500 }
    )
  }

  try {
    // Convert audio to base64
    const buffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(buffer).toString('base64')

    // Use Claude to transcribe the audio
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please transcribe this audio in Spanish. Return ONLY the transcribed text, nothing else.'
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'audio/webm',
                  data: base64Audio
                }
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json() as any
      console.error('Claude API error:', error)
      throw new Error(error.error?.message || 'Transcription failed')
    }

    const data = await response.json() as any
    const text = data.content[0].text

    return Response.json({
      text: text.trim()
    })
  } catch (error) {
    console.error('Error transcribing audio:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error during transcription'
      },
      { status: 500 }
    )
  }
}
