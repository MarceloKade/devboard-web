import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { isAuthenticated } from '../services/auth.service'
import {
  deleteProject,
  getProject,
  updateProject,
  type Project,
} from '../services/projects.service'

export function useProject(id: string) {
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  const [error, setError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: '/login' })
      return
    }

    async function loadProject() {
      try {
        const projectData = await getProject(id)

        setProject(projectData)
        setProjectName(projectData.name)
        setProjectDescription(projectData.description ?? '')
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar o projeto.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id, navigate])

  function handleStartEditing() {
    if (!project) {
      return
    }

    setProjectName(project.name)
    setProjectDescription(project.description ?? '')
    setUpdateError('')
    setEditing(true)
  }

  function handleCancelEditing() {
    if (!project) {
      return
    }

    setProjectName(project.name)
    setProjectDescription(project.description ?? '')
    setUpdateError('')
    setEditing(false)
  }

  async function handleUpdateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setUpdateError('')

    if (!projectName.trim()) {
      setUpdateError('Informe o nome do projeto.')
      return
    }

    try {
      setUpdating(true)

      const updatedProject = await updateProject(id, {
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
      })

      setProject(updatedProject)
      setProjectName(updatedProject.name)
      setProjectDescription(updatedProject.description ?? '')
      setEditing(false)
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Erro ao atualizar o projeto.',
      )
    } finally {
      setUpdating(false)
    }
  }

  async function handleDeleteProject() {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este projeto?',
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)
      setError('')

      await deleteProject(id)

      navigate({ to: '/dashboard' })
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Erro ao excluir o projeto.',
      )
      setDeleting(false)
    }
  }

  return {
    project,
    projectName,
    projectDescription,
    error,
    updateError,
    loading,
    editing,
    updating,
    deleting,
    setProjectName,
    setProjectDescription,
    handleStartEditing,
    handleCancelEditing,
    handleUpdateProject,
    handleDeleteProject,
  }
}
