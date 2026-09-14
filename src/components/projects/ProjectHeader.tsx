type ProjectHeaderProps = {
  project: {
    name: string
    description: string | null
    id: string
    createdAt: string
    updatedAt: string
  }
  deleting: boolean
  onEdit: () => void
  onDelete: () => void
}

export function ProjectHeader({
  project,
  deleting,
  onEdit,
  onDelete,
}: ProjectHeaderProps) {
  return (
    <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
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
            onClick={onEdit}
            disabled={deleting}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={onDelete}
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
          Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
        </p>

        <p>
          Atualizado em{' '}
          {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </section>
  )
}
