import { useEffect, useRef, useState } from 'react'

type MicStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error'
type RecordStatus = 'idle' | 'recording' | 'finished'

export function useMicTest() {
  const [micStatus, setMicStatus] = useState<MicStatus>('idle')
  const [recordStatus, setRecordStatus] = useState<RecordStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [timer, setTimer] = useState(0) // bonus: timer

  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      stopStream()
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const stopStream = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
    mediaStreamRef.current = null
  }

  const requestMicAccess = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('getUserMedia is not supported in this browser.')
      setMicStatus('error')
      return
    }

    setMicStatus('requesting')
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      setMicStatus('granted')
    } catch (err: any) {
      console.error(err)
      if (err?.name === 'NotAllowedError') {
        setMicStatus('denied')
        setError('Microphone permission was denied.')
      } else {
        setMicStatus('error')
        setError('Unable to access microphone.')
      }
    }
  }

  const startRecording = (maxSeconds = 5) => {
    if (!mediaStreamRef.current) return
    if (!window.MediaRecorder) {
      setError('MediaRecorder API is not supported in this browser.')
      return
    }

    setRecordStatus('recording')
    setTimer(0)
    chunksRef.current = []
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }

    const recorder = new MediaRecorder(mediaStreamRef.current)
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setRecordStatus('finished')
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    recorder.start()

    timerRef.current = window.setInterval(() => {
      setTimer((prev) => {
        const next = prev + 1
        if (next >= maxSeconds) {
          stopRecording()
        }
        return next
      })
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const resetTest = () => {
    setRecordStatus('idle')
    setAudioUrl(null)
    setTimer(0)
  }

  return {
    micStatus,
    recordStatus,
    error,
    audioUrl,
    timer,
    requestMicAccess,
    startRecording,
    stopRecording,
    resetTest,
  }
}
