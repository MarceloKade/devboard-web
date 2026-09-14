import type { Task, TaskStatus } from '../../services/tasks.service'

type TaskBoardProps = {
  tasks: Task[]
  draggingTaskId: string | null
  taskError: string
  onOpenTask: (task: Task) => void
  onDragStart: (taskId: string) => void
  onDragEnd: () => void
  onDrop: (status: TaskStatus) => void
  onNewTask: () => void
}

export function TaskBoard({
  tasks,
  draggingTaskId,
  taskError,
  onOpenTask,
  onDragStart,
  onDragEnd,
  onDrop,
  onNewTask,
}: TaskBoardProps) {
  function renderTask(task: Task) {
    return (
      <article
        key={task.id}
        draggable
        onDragStart={() => onDragStart(task.id)}
        onDragEnd={onDragEnd}
        onClick={() => onOpenTask(task)}
        className={`cursor-grab rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-600 hover:bg-gray-800 active:cursor-grabbing ${
          draggingTaskId === task.id ? 'opacity-50' : ''
        }`}
      >
        <h4 className="font-semibold">{task.title}</h4>

        {task.description && (
          <p className="mt-1 text-sm text-gray-400">{task.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{task.priority}</span>

          <span className="text-xs text-gray-600">Clique para abrir</span>
        </div>
      </article>
    )
  }

  const todoTasks = tasks.filter((task) => task.status === 'TODO')
  const inProgressTasks = tasks.filter((task) => task.status === 'IN_PROGRESS')
  const doneTasks = tasks.filter((task) => task.status === 'DONE')

  return (
    <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tarefas</h2>

        <button
          type="button"
          onClick={onNewTask}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 transition hover:bg-gray-200"
        >
          Nova tarefa
        </button>
      </div>

      {taskError && <p className="mt-4 text-sm text-red-400">{taskError}</p>}

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => onDrop('TODO')}
          className="min-h-64 rounded-lg border border-gray-800 bg-gray-950 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">TODO</h3>

            <span className="text-xs text-gray-500">{todoTasks.length}</span>
          </div>

          <div className="mt-4 space-y-3">{todoTasks.map(renderTask)}</div>
        </div>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => onDrop('IN_PROGRESS')}
          className="min-h-64 rounded-lg border border-gray-800 bg-gray-950 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">IN_PROGRESS</h3>

            <span className="text-xs text-gray-500">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {inProgressTasks.map(renderTask)}
          </div>
        </div>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => onDrop('DONE')}
          className="min-h-64 rounded-lg border border-gray-800 bg-gray-950 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">DONE</h3>

            <span className="text-xs text-gray-500">{doneTasks.length}</span>
          </div>

          <div className="mt-4 space-y-3">{doneTasks.map(renderTask)}</div>
        </div>
      </div>
    </section>
  )
}
