import { useEffect, useState } from 'react'

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../services/tasks.service'

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([])

  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('TODO')
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('MEDIUM')
  const [taskError, setTaskError] = useState('')
  const [creatingTask, setCreatingTask] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)

  useEffect(() => {
    async function loadTasks() {
      try {
        const tasksData = await getTasks(projectId)

        setTasks(tasksData)
      } catch (error) {
        setTaskError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar as tarefas.',
        )
      }
    }

    loadTasks()
  }, [projectId])

  function handleOpenCreateTaskModal() {
    setEditingTaskId(null)
    setTaskTitle('')
    setTaskDescription('')
    setTaskStatus('TODO')
    setTaskPriority('MEDIUM')
    setTaskError('')
    setShowTaskModal(true)
  }

  function handleOpenEditTaskModal(task: Task) {
    setEditingTaskId(task.id)
    setTaskTitle(task.title)
    setTaskDescription(task.description ?? '')
    setTaskStatus(task.status)
    setTaskPriority(task.priority)
    setTaskError('')
    setShowTaskModal(true)
  }

  function handleCloseTaskModal() {
    if (creatingTask || deletingTaskId) {
      return
    }

    setShowTaskModal(false)
    setEditingTaskId(null)
    setTaskTitle('')
    setTaskDescription('')
    setTaskStatus('TODO')
    setTaskPriority('MEDIUM')
    setTaskError('')
  }

  async function handleSaveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setTaskError('')

    if (!taskTitle.trim()) {
      setTaskError('Informe o título da tarefa.')
      return
    }

    try {
      setCreatingTask(true)

      if (editingTaskId) {
        const updatedTask = await updateTask(projectId, editingTaskId, {
          title: taskTitle.trim(),
          description: taskDescription.trim() || undefined,
          status: taskStatus,
          priority: taskPriority,
        })

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task,
          ),
        )
      } else {
        const task = await createTask(projectId, {
          title: taskTitle.trim(),
          description: taskDescription.trim() || undefined,
          status: taskStatus,
          priority: taskPriority,
        })

        setTasks((currentTasks) => [task, ...currentTasks])
      }

      handleCloseTaskModal()
    } catch (error) {
      setTaskError(
        error instanceof Error
          ? error.message
          : editingTaskId
            ? 'Erro ao atualizar a tarefa.'
            : 'Erro ao criar a tarefa.',
      )
    } finally {
      setCreatingTask(false)
    }
  }

  async function handleDeleteTask(taskId: string) {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta tarefa?',
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingTaskId(taskId)
      setTaskError('')

      await deleteTask(projectId, taskId)

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      )

      setShowTaskModal(false)
      setEditingTaskId(null)
      setTaskTitle('')
      setTaskDescription('')
      setTaskStatus('TODO')
      setTaskPriority('MEDIUM')
    } catch (error) {
      setTaskError(
        error instanceof Error ? error.message : 'Erro ao excluir a tarefa.',
      )
    } finally {
      setDeletingTaskId(null)
    }
  }

  function handleDragStart(taskId: string) {
    setDraggingTaskId(taskId)
  }

  function handleDragEnd() {
    setDraggingTaskId(null)
  }

  async function handleDrop(status: TaskStatus) {
    if (!draggingTaskId) {
      return
    }

    const task = tasks.find((currentTask) => currentTask.id === draggingTaskId)

    if (!task) {
      setDraggingTaskId(null)
      return
    }

    if (task.status === status) {
      setDraggingTaskId(null)
      return
    }

    try {
      setTaskError('')

      const updatedTask = await updateTask(projectId, task.id, {
        status,
      })

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask,
        ),
      )
    } catch (error) {
      setTaskError(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar o status da tarefa.',
      )
    } finally {
      setDraggingTaskId(null)
    }
  }

  return {
    tasks,
    showTaskModal,
    editingTaskId,
    taskTitle,
    taskDescription,
    taskStatus,
    taskPriority,
    taskError,
    creatingTask,
    deletingTaskId,
    draggingTaskId,
    setTaskTitle,
    setTaskDescription,
    setTaskStatus,
    setTaskPriority,
    handleOpenCreateTaskModal,
    handleOpenEditTaskModal,
    handleCloseTaskModal,
    handleSaveTask,
    handleDeleteTask,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  }
}
