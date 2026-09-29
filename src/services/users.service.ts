import { api } from './api'

export type User = {
  id: string
  name: string
  email: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export async function getCurrentUser(): Promise<User> {
  return api<User>('/users/me')
}

export async function uploadAvatar(file: File): Promise<User> {
  const formData = new FormData()

  formData.append('avatar', file)

  return api<User>('/users/me/avatar', {
    method: 'PATCH',
    body: formData,
  })
}
