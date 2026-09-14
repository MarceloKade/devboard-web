import { api } from './api'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  createdAt: string
  updatedAt: string
}

export type CreateTaskData = {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export type UpdateTaskData = {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export async function getTasks(projectId: string): Promise<Task[]> {
  return api<Task[]>(`/projects/${projectId}/tasks`)
}

export async function getTask(
  projectId: string,
  taskId: string,
): Promise<Task> {
  return api<Task>(`/projects/${projectId}/tasks/${taskId}`)
}

export async function createTask(
  projectId: string,
  data: CreateTaskData,
): Promise<Task> {
  return api<Task>(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTask(
  projectId: string,
  taskId: string,
  data: UpdateTaskData,
): Promise<Task> {
  return api<Task>(`/projects/${projectId}/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteTask(
  projectId: string,
  taskId: string,
): Promise<Task> {
  return api<Task>(`/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
  })
}
