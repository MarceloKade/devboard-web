import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { isAuthenticated } from '../../services/auth.service'
import {
  deleteProject,
  getProject,
  updateProject,
  type Project,
} from '../../services/projects.service'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../../services/tasks.service'
import {
  addProjectMember,
  deleteProjectMember,
  getProjectMembers,
  updateProjectMember,
  type ProjectMember,
  type ProjectMemberRole,
} from '../../services/project-members.service'

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetails,
})

function ProjectDetails() {
  const navigate = useNavigate()
  const { id } = Route.useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [error, setError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const [showMemberModal, setShowMemberModal] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [memberUserId, setMemberUserId] = useState('')
  const [memberRole, setMemberRole] = useState<ProjectMemberRole>('MEMBER')
  const [memberError, setMemberError] = useState('')
  const [savingMember, setSavingMember] = useState(false)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: '/login' })
      return
    }

    async function loadProject() {
      try {
        const [projectData, tasksData, membersData] = await Promise.all([
          getProject(id),
          getTasks(id),
          getProjectMembers(id),
        ])

        setProject(projectData)
        setTasks(tasksData)
        setMembers(membersData)
        setProjectName(projectData.name)
        setProjectDescription(projectData.description ?? '')
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar o projeto.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id, navigate])

  function handleStartEditing() {
    if (!project) {
      return
    }

    setProjectName(project.name)
    setProjectDescription(project.description ?? '')
    setUpdateError('')
    setEditing(true)
  }

  function handleCancelEditing() {
    if (!project) {
      return
    }

    setProjectName(project.name)
    setProjectDescription(project.description ?? '')
    setUpdateError('')
    setEditing(false)
  }

  async function handleUpdateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setUpdateError('')

    if (!projectName.trim()) {
      setUpdateError('Informe o nome do projeto.')
      return
    }

    try {
      setUpdating(true)

      const updatedProject = await updateProject(id, {
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
      })

      setProject(updatedProject)
      setProjectName(updatedProject.name)
      setProjectDescription(updatedProject.description ?? '')
      setEditing(false)
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Erro ao atualizar o projeto.',
      )
    } finally {
      setUpdating(false)
    }
  }

  async function handleDeleteProject() {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este projeto?',
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)
      setError('')

      await deleteProject(id)

      navigate({ to: '/dashboard' })
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Erro ao excluir o projeto.',
      )
      setDeleting(false)
    }
  }

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
        const updatedTask = await updateTask(id, editingTaskId, {
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
        const task = await createTask(id, {
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

      await deleteTask(id, taskId)

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

      const updatedTask = await updateTask(id, task.id, {
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

  function renderTask(task: Task) {
    return (
      <article
        key={task.id}
        draggable
        onDragStart={() => handleDragStart(task.id)}
        onDragEnd={handleDragEnd}
        onClick={() => handleOpenEditTaskModal(task)}
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

  function handleOpenCreateMemberModal() {
    setEditingMemberId(null)
    setMemberUserId('')
    setMemberRole('MEMBER')
    setMemberError('')
    setShowMemberModal(true)
  }

  function handleOpenEditMemberModal(member: ProjectMember) {
    setEditingMemberId(member.id)
    setMemberUserId(member.userId)
    setMemberRole(member.role)
    setMemberError('')
    setShowMemberModal(true)
  }

  function handleCloseMemberModal() {
    if (savingMember || deletingMemberId) {
      return
    }

    setShowMemberModal(false)
    setEditingMemberId(null)
    setMemberUserId('')
    setMemberRole('MEMBER')
    setMemberError('')
  }

  async function handleSaveMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setMemberError('')

    if (!editingMemberId && !memberUserId.trim()) {
      setMemberError('Informe o ID do usuário.')
      return
    }

    try {
      setSavingMember(true)

      if (editingMemberId) {
        const updatedMember = await updateProjectMember(id, editingMemberId, {
          role: memberRole,
        })

        setMembers((currentMembers) =>
          currentMembers.map((member) =>
            member.id === updatedMember.id ? updatedMember : member,
          ),
        )
      } else {
        const member = await addProjectMember(id, {
          userId: memberUserId.trim(),
          role: memberRole,
        })

        setMembers((currentMembers) => [...currentMembers, member])
      }

      handleCloseMemberModal()
    } catch (error) {
      setMemberError(
        error instanceof Error
          ? error.message
          : editingMemberId
            ? 'Erro ao atualizar o membro.'
            : 'Erro ao adicionar o membro.',
      )
    } finally {
      setSavingMember(false)
    }
  }

  async function handleDeleteMember(memberId: string) {
    const confirmed = window.confirm(
      'Tem certeza que deseja remover este membro do projeto?',
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingMemberId(memberId)
      setMemberError('')

      await deleteProjectMember(id, memberId)

      setMembers((currentMembers) =>
        currentMembers.filter((member) => member.id !== memberId),
      )

      setShowMemberModal(false)
      setEditingMemberId(null)
      setMemberUserId('')
      setMemberRole('MEMBER')
    } catch (error) {
      setMemberError(
        error instanceof Error ? error.message : 'Erro ao remover o membro.',
      )
    } finally {
      setDeletingMemberId(null)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Carregando...</p>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Não foi possível carregar o projeto
          </h1>

          <p className="mt-2 text-red-400">
            {error || 'Projeto não encontrado.'}
          </p>

          <button
            type="button"
            onClick={() => navigate({ to: '/dashboard' })}
            className="mt-6 rounded-lg bg-white px-4 py-3 font-medium text-gray-950 transition hover:bg-gray-200"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate({ to: '/dashboard' })}
          className="text-sm text-gray-400 transition hover:text-white"
        >
          ← Voltar para o Dashboard
        </button>

        <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
          {!editing ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{project.name}</h1>

                  {project.description && (
                    <p className="mt-4 text-gray-400">{project.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleStartEditing}
                    disabled={deleting}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteProject}
                    disabled={deleting}
                    className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <p>ID: {project.id}</p>

                <p>
                  Criado em{' '}
                  {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </p>

                <p>
                  Atualizado em{' '}
                  {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Editar projeto</h1>

              <form onSubmit={handleUpdateProject} className="mt-6 space-y-4">
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
                    onChange={(event) => setProjectName(event.target.value)}
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
                    onChange={(event) =>
                      setProjectDescription(event.target.value)
                    }
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500"
                  />
                </div>

                {updateError && (
                  <p className="text-sm text-red-400">{updateError}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEditing}
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
            </>
          )}
        </section>

        {!editing && (
          <>
            <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Tarefas</h2>

                <button
                  type="button"
                  onClick={handleOpenCreateTaskModal}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 transition hover:bg-gray-200"
                >
                  Nova tarefa
                </button>
              </div>

              {taskError && (
                <p className="mt-4 text-sm text-red-400">{taskError}</p>
              )}

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop('TODO')}
                  className="min-h-64 rounded-lg border border-gray-800 bg-gray-950 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">TODO</h3>

                    <span className="text-xs text-gray-500">
                      {tasks.filter((task) => task.status === 'TODO').length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {tasks
                      .filter((task) => task.status === 'TODO')
                      .map(renderTask)}
                  </div>
                </div>

                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop('IN_PROGRESS')}
                  className="min-h-64 rounded-lg border border-gray-800 bg-gray-950 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">IN_PROGRESS</h3>

                    <span className="text-xs text-gray-500">
                      {
                        tasks.filter((task) => task.status === 'IN_PROGRESS')
                          .length
                      }
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {tasks
                      .filter((task) => task.status === 'IN_PROGRESS')
                      .map(renderTask)}
                  </div>
                </div>

                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop('DONE')}
                  className="min-h-64 rounded-lg border border-gray-800 bg-gray-950 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">DONE</h3>

                    <span className="text-xs text-gray-500">
                      {tasks.filter((task) => task.status === 'DONE').length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {tasks
                      .filter((task) => task.status === 'DONE')
                      .map(renderTask)}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Membros</h2>

                <button
                  type="button"
                  onClick={handleOpenCreateMemberModal}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 transition hover:bg-gray-200"
                >
                  Adicionar membro
                </button>
              </div>

              {memberError && !showMemberModal && (
                <p className="mt-4 text-sm text-red-400">{memberError}</p>
              )}

              {members.length === 0 ? (
                <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950 p-6">
                  <p className="text-gray-400">
                    Este projeto ainda não possui membros.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleOpenEditMemberModal(member)}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-4 text-left transition hover:border-gray-600 hover:bg-gray-800"
                    >
                      <div>
                        <p className="font-medium">{member.user.name}</p>

                        <p className="mt-1 text-sm text-gray-400">
                          {member.user.email}
                        </p>
                      </div>

                      <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400">
                        {member.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {showTaskModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseTaskModal()
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
                onClick={handleCloseTaskModal}
                disabled={creatingTask || !!deletingTaskId}
                className="text-2xl leading-none text-gray-500 transition hover:text-white disabled:cursor-not-allowed"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="mt-6 space-y-4">
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
                  onChange={(event) => setTaskTitle(event.target.value)}
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
                  onChange={(event) => setTaskDescription(event.target.value)}
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
                      setTaskStatus(event.target.value as TaskStatus)
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
                      setTaskPriority(event.target.value as TaskPriority)
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
                    onClick={() => handleDeleteTask(editingTaskId)}
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
                    onClick={handleCloseTaskModal}
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
      )}

      {showMemberModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseMemberModal()
            }
          }}
        >
          <div className="w-full max-w-lg rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingMemberId ? 'Editar membro' : 'Adicionar membro'}
              </h2>

              <button
                type="button"
                onClick={handleCloseMemberModal}
                disabled={savingMember || !!deletingMemberId}
                className="text-2xl leading-none text-gray-500 transition hover:text-white disabled:cursor-not-allowed"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="mt-6 space-y-4">
              {!editingMemberId && (
                <div>
                  <label
                    htmlFor="member-user-id"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    ID do usuário
                  </label>

                  <input
                    id="member-user-id"
                    type="text"
                    value={memberUserId}
                    onChange={(event) => setMemberUserId(event.target.value)}
                    placeholder="UUID do usuário"
                    autoFocus
                    disabled={savingMember || !!deletingMemberId}
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Informe o ID do usuário que deseja adicionar ao projeto.
                  </p>
                </div>
              )}

              {editingMemberId && (
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                  <p className="font-medium">
                    {
                      members.find((member) => member.id === editingMemberId)
                        ?.user.name
                    }
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {
                      members.find((member) => member.id === editingMemberId)
                        ?.user.email
                    }
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="member-role"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Role
                </label>

                <select
                  id="member-role"
                  value={memberRole}
                  onChange={(event) =>
                    setMemberRole(event.target.value as ProjectMemberRole)
                  }
                  disabled={savingMember || !!deletingMemberId}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {memberError && (
                <p className="text-sm text-red-400">{memberError}</p>
              )}

              <div className="flex items-center justify-between gap-3">
                {editingMemberId ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(editingMemberId)}
                    disabled={savingMember || !!deletingMemberId}
                    className="rounded-lg border border-red-900 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingMemberId === editingMemberId
                      ? 'Removendo...'
                      : 'Remover membro'}
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseMemberModal}
                    disabled={savingMember || !!deletingMemberId}
                    className="rounded-lg border border-gray-700 px-4 py-3 text-sm font-medium transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={savingMember || !!deletingMemberId}
                    className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingMember
                      ? editingMemberId
                        ? 'Salvando...'
                        : 'Adicionando...'
                      : editingMemberId
                        ? 'Salvar alterações'
                        : 'Adicionar membro'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
