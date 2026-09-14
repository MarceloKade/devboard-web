import { api } from './api'

export type ProjectMemberRole = 'ADMIN' | 'MEMBER'

export type ProjectMember = {
  id: string
  projectId: string
  userId: string
  role: ProjectMemberRole
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
}

export type AddProjectMemberData = {
  userId: string
  role: ProjectMemberRole
}

export type UpdateProjectMemberData = {
  role: ProjectMemberRole
}

export async function getProjectMembers(
  projectId: string,
): Promise<ProjectMember[]> {
  return api<ProjectMember[]>(`/projects/${projectId}/members`)
}

export async function addProjectMember(
  projectId: string,
  data: AddProjectMemberData,
): Promise<ProjectMember> {
  return api<ProjectMember>(`/projects/${projectId}/members`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProjectMember(
  projectId: string,
  memberId: string,
  data: UpdateProjectMemberData,
): Promise<ProjectMember> {
  return api<ProjectMember>(`/projects/${projectId}/members/${memberId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteProjectMember(
  projectId: string,
  memberId: string,
): Promise<ProjectMember> {
  return api<ProjectMember>(`/projects/${projectId}/members/${memberId}`, {
    method: 'DELETE',
  })
}
