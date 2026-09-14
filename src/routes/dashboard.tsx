import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { api } from '../services/api'
import { isAuthenticated, removeAccessToken } from '../services/auth.service'
import { getProjects, type Project } from '../services/projects.service'

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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projetos</h2>
          </div>

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
