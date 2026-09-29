import type { Task, TaskStatus } from '../../services/tasks.service'

import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { TaskCard } from './TaskCard'

type TaskBoardProps = {
  tasks: Task[]
  draggingTaskId: string | null
  taskError: string
  currentUserId: string | undefined
  isAdmin: boolean
  onOpenTask: (task: Task) => void
  onDragStart: (taskId: string) => void
  onDragEnd: () => void
  onDrop: (status: TaskStatus) => void
  onNewTask: () => void
}

const columns: {
  status: TaskStatus
  title: string
}[] = [
  {
    status: 'TODO',
    title: 'TODO',
  },
  {
    status: 'IN_PROGRESS',
    title: 'IN_PROGRESS',
  },
  {
    status: 'DONE',
    title: 'DONE',
  },
]

export function TaskBoard({
  tasks,
  draggingTaskId,
  taskError,
  currentUserId,
  isAdmin,
  onOpenTask,
  onDragStart,
  onDragEnd,
  onDrop,
  onNewTask,
}: TaskBoardProps) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tarefas</h2>

        <Button type="button" onClick={onNewTask}>
          Nova tarefa
        </Button>
      </div>

      {taskError && <p className="mt-4 text-sm text-red-400">{taskError}</p>}

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status,
          )

          return (
            <Card
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDrop(column.status)}
              className="min-h-64 bg-gray-950 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.title}</h3>

                <span className="text-xs text-gray-500">
                  {columnTasks.length}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {columnTasks.map((task) => {
                  const canEditTask =
                    isAdmin || task.createdById === currentUserId

                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      dragging={draggingTaskId === task.id}
                      disabled={!canEditTask}
                      onDragStart={() => onDragStart(task.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => onOpenTask(task)}
                    />
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
