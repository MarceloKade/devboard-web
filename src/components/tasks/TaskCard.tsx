import type { Task } from '../../services/tasks.service'

import { Card } from '../ui/Card'

type TaskCardProps = {
  task: Task
  dragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onClick: () => void
}

export function TaskCard({
  task,
  dragging,
  onDragStart,
  onDragEnd,
  onClick,
}: TaskCardProps) {
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`cursor-grab bg-gray-900 p-4 transition hover:border-gray-600 hover:bg-gray-800 active:cursor-grabbing ${
        dragging ? 'opacity-50' : ''
      }`}
    >
      {' '}
      <div className="flex items-center justify-between gap-3">
        {' '}
        <h4 className="font-semibold">{task.title}</h4>
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
          {task.createdBy.avatar ? (
            <img
              src={task.createdBy.avatar}
              alt="Avatar do criador"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
              ?
            </div>
          )}
        </div>
      </div>
      {task.description && (
        <p className="mt-1 text-sm text-gray-400">{task.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{task.priority}</span>

        <span className="text-xs text-gray-600">Clique para abrir</span>
      </div>
    </Card>
  )
}
