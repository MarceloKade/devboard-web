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
            onChange={(event) => onNameChange(event.target.value)}
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
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500"
          />
        </div>

        {updateError && <p className="text-sm text-red-400">{updateError}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
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
    </section>
  )
}
