import { useEffect, useRef, useState } from 'react'

import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

type AvatarModalProps = {
  currentAvatar: string | null
  onConfirm: (file: File) => Promise<void>
  onClose: () => void
}

export function AvatarModal({
  currentAvatar,
  onConfirm,
  onClose,
}: AvatarModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(selectedFile)

    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [selectedFile])

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !streamRef.current) {
      return
    }

    videoRef.current.srcObject = streamRef.current
  }, [cameraOpen])

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })

      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraOpen(false)
  }

  async function handleOpenCamera() {
    setError('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })

      streamRef.current = stream
      setCameraOpen(true)
    } catch {
      setError(
        'Não foi possível acessar a câmera. Verifique a permissão do navegador.',
      )
    }
  }

  function handleCapturePhoto() {
    const video = videoRef.current

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError('A câmera ainda não está pronta para tirar a foto.')
      return
    }

    const canvas = document.createElement('canvas')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    if (!context) {
      setError('Não foi possível capturar a foto.')
      return
    }

    // Mantém a mesma orientação espelhada do preview da câmera.
    context.translate(canvas.width, 0)
    context.scale(-1, 1)

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Não foi possível capturar a foto.')
          return
        }

        const file = new File([blob], `avatar-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })

        setSelectedFile(file)
        setError('')
        stopCamera()
      },
      'image/jpeg',
      0.9,
    )
  }

  function handleChooseImage() {
    stopCamera()
    fileInputRef.current?.click()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setError('')

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Escolha uma imagem JPG, PNG ou WEBP.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5 MB.')
      event.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  async function handleConfirm() {
    if (!selectedFile) {
      setError('Escolha uma imagem antes de confirmar.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await onConfirm(selectedFile)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o avatar.',
      )
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    if (saving) {
      return
    }

    stopCamera()
    setSelectedFile(null)
    setError('')
    onClose()
  }

  return (
    <Modal title="Alterar avatar" onClose={handleClose} disabled={saving}>
      <div className="space-y-6">
        <div className="flex justify-center">
          {cameraOpen ? (
            <div className="h-64 w-full overflow-hidden rounded-lg border border-gray-700 bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover -scale-x-100"
              />
            </div>
          ) : (
            <div className="h-32 w-32 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Prévia do novo avatar"
                  className="h-full w-full object-cover"
                />
              ) : currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Avatar atual"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-gray-400">
                  ?
                </div>
              )}
            </div>
          )}
        </div>

        {cameraOpen ? (
          <div className="flex justify-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={stopCamera}
              disabled={saving}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleCapturePhoto}
              disabled={saving}
            >
              Tirar foto
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleOpenCamera}
              disabled={saving}
            >
              Tirar foto
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleChooseImage}
              disabled={saving}
            >
              Escolher imagem
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedFile || saving || cameraOpen}
          >
            {saving ? 'Salvando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
