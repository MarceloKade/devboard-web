import { api } from './api'

export type Project = {
  id: string
  name: string
  description: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
}

export async function getProjects(): Promise<Project[]> {
  return api<Project[]>('/projects')
}
