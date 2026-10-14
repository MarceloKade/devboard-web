import { api } from './api'

export type User = {
  id: string
  name: string
  email: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export type UpdateUserData = {
  name?: string
  email?: string
}

export async function getCurrentUser(): Promise<User> {
  return api<User>('/users/me')
}

export async function updateUser(
  id: string,
  data: UpdateUserData,
): Promise<User> {
  return api<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function uploadAvatar(file: File): Promise<User> {
  const formData = new FormData()

  formData.append('avatar', file)

  return api<User>('/users/me/avatar', {
    method: 'PATCH',
    body: formData,
  })
}
