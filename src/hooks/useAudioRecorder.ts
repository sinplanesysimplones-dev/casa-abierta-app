import { useState, useRef, useCallback } from 'react'

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
    if (!audioBlob) return

    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error al transcribir audio')
      }

      const data = await response.json()
      setTranscript(data.text)
    } catch (error) {
      console.error('Error transcribiendo:', error)
      alert('Error al transcribir el audio. Intenta de nuevo.')
    } finally {
      setIsTranscribing(false)
    }
  }, [audioBlob])

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
    transcribeAudio
  }
}
