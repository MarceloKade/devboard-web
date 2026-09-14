import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { api } from '../services/api'
import { isAuthenticated, removeAccessToken } from '../services/auth.service'
import {
  createProject,
  getProjects,
  type Project,
} from '../services/projects.service'

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
    } catch (error) {
      setProjectError(
        error instanceof Error ? error.message : 'Erro ao criar o projeto.',
      )
    } finally {
      setCreatingProject(false)
    }
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

          <button
            type="button"
            onClick={() => navigate({ to: '/login' })}
            className="mt-6 rounded-lg bg-white px-4 py-3 font-medium text-gray-950 transition hover:bg-gray-200"
          >
            Ir para o login
          </button>
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

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium transition hover:bg-gray-900"
          >
            Sair
          </button>
        </header>

        <section className="mt-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Novo projeto</h2>

          <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="project-name"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Nome
              </label>

              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Nome do projeto"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="project-description"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Descrição
              </label>

              <textarea
                id="project-description"
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="Descrição do projeto"
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500"
              />
            </div>

            {projectError && (
              <p className="text-sm text-red-400">{projectError}</p>
            )}

            <button
              type="submit"
              disabled={creatingProject}
              className="rounded-lg bg-white px-4 py-3 font-medium text-gray-950 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creatingProject ? 'Criando...' : 'Criar projeto'}
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
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
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Projetos</h2>

          {projects.length === 0 ? (
            <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-6">
              <p className="text-gray-400">
                Você ainda não possui nenhum projeto.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-lg border border-gray-800 bg-gray-900 p-6"
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
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
