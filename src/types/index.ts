export interface IkigaiResponse {
  id: string
  timestamp: number
  answers: {
    love: string
    good: string
    needed: string
    paid: string
  }
  result: {
    resumen_ikigai: string
    ideas: string[]
    arquetipo: string
    frase_sticker: string
  }
}

export interface QuestionData {
  key: keyof IkigaiResponse['answers']
  question: string
  placeholder: string
  ikigaiPillar: string
}
