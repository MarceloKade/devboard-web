import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { getProject, type Project } from '../../services/projects.service'
import { isAuthenticated } from '../../services/auth.service'

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetails,
})

function ProjectDetails() {
  const navigate = useNavigate()
  const { id } = Route.useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: '/login' })
      return
    }

    async function loadProject() {
      try {
        const data = await getProject(id)

        setProject(data)
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Carregando...</p>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Não foi possível carregar o projeto
          </h1>

          <p className="mt-2 text-red-400">
            {error || 'Projeto não encontrado.'}
          </p>

          <button
            type="button"
            onClick={() => navigate({ to: '/dashboard' })}
            className="mt-6 rounded-lg bg-white px-4 py-3 font-medium text-gray-950 transition hover:bg-gray-200"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate({ to: '/dashboard' })}
          className="text-sm text-gray-400 transition hover:text-white"
        >
          ← Voltar para o Dashboard
        </button>

        <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h1 className="text-3xl font-bold">{project.name}</h1>

          {project.description && (
            <p className="mt-4 text-gray-400">{project.description}</p>
          )}

          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <p>ID: {project.id}</p>

            <p>
              Criado em{' '}
              {new Date(project.createdAt).toLocaleDateString('pt-BR')}
            </p>

            <p>
              Atualizado em{' '}
              {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
