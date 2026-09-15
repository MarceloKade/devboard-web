import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { api } from '../services/api'
import { isAuthenticated, removeAccessToken } from '../services/auth.service'
import {
  createProject,
  getProjects,
  type Project,
} from '../services/projects.service'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Textarea'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

type User = {
  id: string
  name: string
  email: string
}

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [error, setError] = useState('')
  const [projectError, setProjectError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creatingProject, setCreatingProject] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: '/login' })
      return
    }

    async function loadDashboard() {
      try {
        const [userData, projectsData] = await Promise.all([
          api<User>('/users/me'),
          getProjects(),
        ])

        setUser(userData)
        setProjects(projectsData)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar o Dashboard.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Carregando...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Não foi possível acessar o Dashboard
          </h1>

          <p className="mt-2 text-red-400">{error}</p>

          <Button
            type="button"
            onClick={() => navigate({ to: '/login' })}
            className="mt-6"
          >
            Ir para o login
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <p className="mt-2 text-gray-400">Bem-vindo, {user?.name}!</p>
          </div>

          <Button type="button" variant="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </header>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projetos</h2>

            <Button type="button" onClick={() => setShowProjectModal(true)}>
              Novo Projeto
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card className="mt-4 bg-gray-950 p-6">
              <p className="text-gray-400">
                Você ainda não possui nenhum projeto.
              </p>
            </Card>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  onClick={() =>
                    navigate({
                      to: '/projects/$id',
                      params: { id: project.id },
                    })
                  }
                  className="cursor-pointer bg-gray-900 p-6 transition hover:border-gray-600 hover:bg-gray-800"
                >
                  <h3 className="text-lg font-semibold">{project.name}</h3>

                  {project.description && (
                    <p className="mt-2 text-sm text-gray-400">
                      {project.description}
                    </p>
                  )}

                  <p className="mt-4 text-xs text-gray-600">
                    Criado em{' '}
                    {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold">Seus dados</h2>

          <div className="mt-4 space-y-2 text-gray-300">
            <p>
              <span className="font-medium text-white">Nome:</span> {user?.name}
            </p>

            <p>
              <span className="font-medium text-white">E-mail:</span>{' '}
              {user?.email}
            </p>

            <p>
              <span className="font-medium text-white">ID:</span> {user?.id}
            </p>
          </div>
        </Card>
      </div>

      {showProjectModal && (
        <Modal
          title="Novo Projeto"
          onClose={handleCloseProjectModal}
          disabled={creatingProject}
        >
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <Label htmlFor="project-name">Nome</Label>

              <Input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Nome do projeto"
                autoFocus
                disabled={creatingProject}
              />
            </div>

            <div>
              <Label htmlFor="project-description">Descrição</Label>

              <Textarea
                id="project-description"
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="Descrição do projeto"
                rows={4}
                disabled={creatingProject}
              />
            </div>

            {projectError && (
              <p className="text-sm text-red-400">{projectError}</p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseProjectModal}
                disabled={creatingProject}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={creatingProject}>
                {creatingProject ? 'Criando...' : 'Criar projeto'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
