interface ClassificationResult {
  resumen_ikigai: string
  ideas: string[]
  arquetipo: string
  frase_sticker: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function classifyWithClaude(answers: {
  love: string
  good: string
  needed: string
  paid: string
}): Promise<ClassificationResult> {
  try {
    // Llamar al backend seguro en lugar de a Claude directamente
    const endpoint = API_BASE_URL ? `${API_BASE_URL}/api/classify` : '/api/classify'

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        love: answers.love,
        good: answers.good,
        needed: answers.needed,
        paid: answers.paid
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error en clasificación:', error)
    throw error
  }
}
