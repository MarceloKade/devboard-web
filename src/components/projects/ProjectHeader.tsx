import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

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
    <Card className="mt-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>

          {project.description && (
            <p className="mt-4 text-gray-400">{project.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onEdit}
            disabled={deleting}
          >
            Editar
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-gray-500">
        <p>
          Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
        </p>

        <p>
          Atualizado em{' '}
          {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </Card>
  )
}
