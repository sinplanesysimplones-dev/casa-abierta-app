export async function POST(request: Request) {
  const formData = await request.formData()
  const audioFile = formData.get('audio') as File

  if (!audioFile) {
    return Response.json(
      { error: 'No audio file provided' },
      { status: 400 }
    )
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('OpenAI API key not found')
    return Response.json(
      { error: 'Transcription service not configured' },
      { status: 500 }
    )
  }

  try {
    const transcribeFormData = new FormData()
    transcribeFormData.append('file', audioFile)
    transcribeFormData.append('model', 'whisper-1')
    transcribeFormData.append('language', 'es')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: transcribeFormData
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Whisper API error:', error)
      throw new Error(error.error?.message || 'Transcription failed')
    }

    const data = await response.json()

    return Response.json({
      text: data.text
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
