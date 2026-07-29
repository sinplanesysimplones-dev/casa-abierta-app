import { toPng } from 'html-to-image'

export async function downloadResultAsImage(element: HTMLElement, resultId: string) {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    })

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `arquetipo-${resultId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error descargando imagen:', error)
    throw error
  }
}
