import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'

type ProjectFormProps = {
  projectName: string
  projectDescription: string
  updateError: string
  updating: boolean
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function ProjectForm({
  projectName,
  projectDescription,
  updateError,
  updating,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  return (
    <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h1 className="text-2xl font-bold">Editar projeto</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="project-name">Nome</Label>

          <Input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="project-description">Descrição</Label>

          <Textarea
            id="project-description"
            value={projectDescription}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={4}
          />
        </div>

        {updateError && <p className="text-sm text-red-400">{updateError}</p>}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={updating}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={updating}>
            {updating ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </section>
  )
}
