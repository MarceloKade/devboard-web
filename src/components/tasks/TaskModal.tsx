import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

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
  const disabled = creatingTask || !!deletingTaskId

  return (
    <Modal
      title={editingTaskId ? 'Editar tarefa' : 'Nova tarefa'}
      onClose={onClose}
      disabled={disabled}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="task-title">Título</Label>

          <Input
            id="task-title"
            type="text"
            value={taskTitle}
            onChange={(event) => onTitleChange(event.target.value)}
            autoFocus
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="task-description">Descrição</Label>

          <Textarea
            id="task-description"
            value={taskDescription}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={4}
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="task-status">Status</Label>

          <Select
            id="task-status"
            value={taskStatus}
            onChange={(event) =>
              onStatusChange(event.target.value as TaskStatus)
            }
            disabled={disabled}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="task-priority">Prioridade</Label>

          <Select
            id="task-priority"
            value={taskPriority}
            onChange={(event) =>
              onPriorityChange(event.target.value as TaskPriority)
            }
            disabled={disabled}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </Select>
        </div>

        {taskError && <p className="text-sm text-red-400">{taskError}</p>}

        <div className="flex items-center justify-between gap-3">
          {editingTaskId ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => onDelete(editingTaskId)}
              disabled={disabled}
            >
              {deletingTaskId === editingTaskId
                ? 'Excluindo...'
                : 'Excluir tarefa'}
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={disabled}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={disabled}>
              {creatingTask
                ? editingTaskId
                  ? 'Salvando...'
                  : 'Criando...'
                : editingTaskId
                  ? 'Salvar alterações'
                  : 'Criar tarefa'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
