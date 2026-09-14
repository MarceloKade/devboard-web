import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { isAuthenticated } from '../../services/auth.service'
import {
  deleteProject,
  getProject,
  updateProject,
  type Project,
} from '../../services/projects.service'

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetails,
})

function ProjectDetails() {
  const navigate = useNavigate()
  const { id } = Route.useParams()

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
        const data = await getProject(id)

        setProject(data)
        setProjectName(data.name)
        setProjectDescription(data.description ?? '')
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
          {!editing ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{project.name}</h1>

                  {project.description && (
                    <p className="mt-4 text-gray-400">{project.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleStartEditing}
                    disabled={deleting}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteProject}
                    disabled={deleting}
                    className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>

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
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Editar projeto</h1>

              <form onSubmit={handleUpdateProject} className="mt-6 space-y-4">
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
                    onChange={(event) =>
                      setProjectDescription(event.target.value)
                    }
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500"
                  />
                </div>

                {updateError && (
                  <p className="text-sm text-red-400">{updateError}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    disabled={updating}
                    className="rounded-lg border border-gray-700 px-4 py-3 text-sm font-medium transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
