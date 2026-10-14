import { useEffect, useState } from 'react'

import {
  getCurrentUser,
  updateUser,
  uploadAvatar,
  type User,
} from '../services/users.service'

export function useUsers() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [avatarError, setAvatarError] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [showUserModal, setShowUserModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userUpdateError, setUserUpdateError] = useState('')
  const [updatingUser, setUpdatingUser] = useState(false)

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

  function handleOpenUserModal() {
    if (!user) {
      return
    }

    setUserName(user.name)
    setUserEmail(user.email)
    setUserUpdateError('')
    setShowUserModal(true)
  }

  function handleCloseUserModal() {
    if (updatingUser) {
      return
    }

    setShowUserModal(false)
    setUserUpdateError('')
  }

  function handleOpenAvatarModal() {
    setAvatarError('')
    setShowAvatarModal(true)
  }

  function handleCloseAvatarModal() {
    if (uploadingAvatar) {
      return
    }

    setShowAvatarModal(false)
    setAvatarError('')
  }

  async function handleUpdateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user) {
      return
    }

    setUserUpdateError('')

    try {
      setUpdatingUser(true)

      const updatedUser = await updateUser(user.id, {
        name: userName,
        email: userEmail,
      })

      setUser(updatedUser)
      setShowUserModal(false)
    } catch (error) {
      setUserUpdateError(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar os dados do usuário.',
      )
    } finally {
      setUpdatingUser(false)
    }
  }

  async function handleAvatarChange(file: File) {
    setAvatarError('')

    try {
      setUploadingAvatar(true)

      const updatedUser = await uploadAvatar(file)

      setUser(updatedUser)
      setShowAvatarModal(false)
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

    showUserModal,
    userName,
    userEmail,
    userUpdateError,
    updatingUser,
    setUserName,
    setUserEmail,
    handleOpenUserModal,
    handleCloseUserModal,

    showAvatarModal,
    handleOpenAvatarModal,
    handleCloseAvatarModal,

    handleUpdateUser,
  }
}
