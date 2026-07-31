import { useState, useRef, useCallback } from 'react'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export interface UseAudioRecorderReturn {
  isRecording: boolean
  duration: number
  audioBlob: Blob | null
  transcript: string
  isTranscribing: boolean
  startRecording: () => Promise<void>
  stopRecording: () => Promise<void>
  resetRecording: () => void
  transcribeAudio: () => Promise<void>
  setTranscript: (text: string) => void
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      chunksRef.current = []
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstart = () => {
        setIsRecording(true)
        setDuration(0)

        intervalRef.current = setInterval(() => {
          setDuration(prev => {
            if (prev >= 15) {
              mediaRecorder.stop()
              return prev
            }
            return prev + 1
          })
        }, 1000)
      }

      mediaRecorder.onstop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsRecording(false)

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)

        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
    } catch (error) {
      console.error('Error al acceder al micrófono:', error)
      alert('No se pudo acceder al micrófono. Verifica los permisos.')
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }, [isRecording])

  const transcribeAudio = useCallback(async () => {
    setIsTranscribing(true)

    // Usar Web Speech API nativa del navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn('Web Speech API no disponible, usando entrada manual')
      const manualText = prompt(
        '⚠️ Web Speech API no disponible en este navegador.\n\n' +
        'Por favor, escribe manualmente lo que dijiste:'
      )
      if (manualText) {
        setTranscript(manualText)
      }
      setIsTranscribing(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'es-ES'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log('Escuchando...')
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            interimTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }
        if (interimTranscript) {
          setTranscript(interimTranscript.trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error)
        const errorMsg = `Error: ${event.error}`

        // Fallback a entrada manual
        const manualText = prompt(
          `⚠️ ${errorMsg}\n\n` +
          'Por favor, escribe manualmente lo que dijiste:'
        )
        if (manualText) {
          setTranscript(manualText)
        }
      }

      recognition.onend = () => {
        console.log('Reconocimiento finalizado')
      }

      // Reproducir audio grabado y hacer reconocimiento simultáneamente
      recognition.start()
    } catch (error) {
      console.error('Error transcribiendo:', error)
      const manualText = prompt(
        '⚠️ No se pudo transcribir automáticamente.\n\n' +
        'Por favor, escribe manualmente lo que dijiste:'
      )
      if (manualText) {
        setTranscript(manualText)
      }
    } finally {
      setIsTranscribing(false)
    }
  }, [])

  const resetRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRecording(false)
    setDuration(0)
    setAudioBlob(null)
    setTranscript('')
    chunksRef.current = []
  }, [])

  return {
    isRecording,
    duration,
    audioBlob,
    transcript,
    isTranscribing,
    startRecording,
    stopRecording,
    resetRecording,
    transcribeAudio,
    setTranscript
  }
}
