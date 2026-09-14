import { api } from './api'

export type Project = {
  id: string
  name: string
  description: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
}

export type CreateProjectData = {
  name: string
  description?: string
}

export async function getProjects(): Promise<Project[]> {
  return api<Project[]>('/projects')
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  return api<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getProject(id: string): Promise<Project> {
  return api<Project>(`/projects/${id}`)
}
