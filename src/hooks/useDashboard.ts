import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
  createProject,
  getProjects,
  type Project,
} from '../services/projects.service'

import { isAuthenticated, removeAccessToken } from '../services/auth.service'

export function useDashboard() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectError, setProjectError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creatingProject, setCreatingProject] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: '/login' })
      return
    }

    async function loadProjects() {
      try {
        const projectsData = await getProjects()

        setProjects(projectsData)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar os projetos.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [navigate])

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setProjectError('')

    if (!projectName.trim()) {
      setProjectError('Informe o nome do projeto.')
      return
    }

    try {
      setCreatingProject(true)

      const project = await createProject({
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
      })

      setProjects((currentProjects) => [project, ...currentProjects])

      setProjectName('')
      setProjectDescription('')
      setShowProjectModal(false)
    } catch (error) {
      setProjectError(
        error instanceof Error ? error.message : 'Erro ao criar o projeto.',
      )
    } finally {
      setCreatingProject(false)
    }
  }

  function handleCloseProjectModal() {
    if (creatingProject) {
      return
    }

    setShowProjectModal(false)
    setProjectError('')
    setProjectName('')
    setProjectDescription('')
  }

  function handleLogout() {
    removeAccessToken()

    navigate({ to: '/login' })
  }

  return {
    projects,
    projectName,
    projectDescription,
    projectError,
    loading,
    creatingProject,
    showProjectModal,
    error,
    setProjectName,
    setProjectDescription,
    setShowProjectModal,
    handleCreateProject,
    handleCloseProjectModal,
    handleLogout,
  }
}
