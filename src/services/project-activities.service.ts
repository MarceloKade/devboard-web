import { api } from './api'

export type ProjectActivity = {
  id: string
  projectId: string
  userId: string
  type: string
  message: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
}

export async function getProjectActivities(
  projectId: string,
): Promise<ProjectActivity[]> {
  return api<ProjectActivity[]>(`/projects/${projectId}/activities`)
}
