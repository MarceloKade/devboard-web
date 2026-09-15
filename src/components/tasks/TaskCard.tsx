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
      <h4 className="font-semibold">{task.title}</h4>

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
