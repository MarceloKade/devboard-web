import { useEffect, useState } from 'react'

import {
  getCurrentUser,
  uploadAvatar,
  type User,
} from '../services/users.service'

export function useUsers() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [avatarError, setAvatarError] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()

        setUser(userData)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar o usuário.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function handleAvatarChange(file: File) {
    setAvatarError('')

    try {
      setUploadingAvatar(true)

      const updatedUser = await uploadAvatar(file)

      setUser(updatedUser)
    } catch (error) {
      setAvatarError(
        error instanceof Error ? error.message : 'Erro ao enviar o avatar.',
      )

      throw error
    } finally {
      setUploadingAvatar(false)
    }
  }

  return {
    user,
    error,
    loading,
    avatarError,
    uploadingAvatar,
    handleAvatarChange,
  }
}
