import type { TaskPriority, TaskStatus } from '../../services/tasks.service'

type TaskModalProps = {
  editingTaskId: string | null
  taskTitle: string
  taskDescription: string
  taskStatus: TaskStatus
  taskPriority: TaskPriority
  taskError: string
  creatingTask: boolean
  deletingTaskId: string | null
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onStatusChange: (value: TaskStatus) => void
  onPriorityChange: (value: TaskPriority) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
  onDelete: (taskId: string) => void
}

export function TaskModal({
  editingTaskId,
  taskTitle,
  taskDescription,
  taskStatus,
  taskPriority,
  taskError,
  creatingTask,
  deletingTaskId,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onPriorityChange,
  onSubmit,
  onClose,
  onDelete,
}: TaskModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="w-full max-w-lg rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editingTaskId ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={creatingTask || !!deletingTaskId}
            className="text-2xl leading-none text-gray-500 transition hover:text-white disabled:cursor-not-allowed"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Título
            </label>

            <input
              id="task-title"
              type="text"
              value={taskTitle}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Título da tarefa"
              autoFocus
              disabled={!!deletingTaskId}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Descrição
            </label>

            <textarea
              id="task-description"
              value={taskDescription}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Descrição da tarefa"
              rows={4}
              disabled={!!deletingTaskId}
              className="w-full resize-none border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-status"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Status
              </label>

              <select
                id="task-status"
                value={taskStatus}
                onChange={(event) =>
                  onStatusChange(event.target.value as TaskStatus)
                }
                disabled={!!deletingTaskId}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Prioridade
              </label>

              <select
                id="task-priority"
                value={taskPriority}
                onChange={(event) =>
                  onPriorityChange(event.target.value as TaskPriority)
                }
                disabled={!!deletingTaskId}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
          </div>

          {taskError && <p className="text-sm text-red-400">{taskError}</p>}

          <div className="flex items-center justify-between gap-3">
            {editingTaskId ? (
              <button
                type="button"
                onClick={() => onDelete(editingTaskId)}
                disabled={creatingTask || !!deletingTaskId}
                className="rounded-lg border border-red-900 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingTaskId === editingTaskId
                  ? 'Excluindo...'
                  : 'Excluir tarefa'}
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={creatingTask || !!deletingTaskId}
                className="rounded-lg border border-gray-700 px-4 py-3 text-sm font-medium transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={creatingTask || !!deletingTaskId}
                className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingTask
                  ? editingTaskId
                    ? 'Salvando...'
                    : 'Criando...'
                  : editingTaskId
                    ? 'Salvar alterações'
                    : 'Criar tarefa'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
