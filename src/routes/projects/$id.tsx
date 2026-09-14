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

import { ProjectHeader } from '../../components/projects/ProjectHeader'
import { ProjectForm } from '../../components/projects/ProjectForm'
import { TaskBoard } from '../../components/tasks/TaskBoard'
import { TaskModal } from '../../components/tasks/TaskModal'
import { MemberList } from '../../components/project-members/MemberList'
import { MemberModal } from '../../components/project-members/MemberModal'

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

        {editing ? (
          <ProjectForm
            projectName={projectName}
            projectDescription={projectDescription}
            updateError={updateError}
            updating={updating}
            onNameChange={setProjectName}
            onDescriptionChange={setProjectDescription}
            onSubmit={handleUpdateProject}
            onCancel={handleCancelEditing}
          />
        ) : (
          <>
            <ProjectHeader
              project={project}
              deleting={deleting}
              onEdit={handleStartEditing}
              onDelete={handleDeleteProject}
            />

            <TaskBoard
              tasks={tasks}
              draggingTaskId={draggingTaskId}
              taskError={taskError}
              onOpenTask={handleOpenEditTaskModal}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onNewTask={handleOpenCreateTaskModal}
            />

            <MemberList
              members={members}
              memberError={memberError}
              onAddMember={handleOpenCreateMemberModal}
              onEditMember={handleOpenEditMemberModal}
            />
          </>
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          editingTaskId={editingTaskId}
          taskTitle={taskTitle}
          taskDescription={taskDescription}
          taskStatus={taskStatus}
          taskPriority={taskPriority}
          taskError={taskError}
          creatingTask={creatingTask}
          deletingTaskId={deletingTaskId}
          onTitleChange={setTaskTitle}
          onDescriptionChange={setTaskDescription}
          onStatusChange={setTaskStatus}
          onPriorityChange={setTaskPriority}
          onSubmit={handleSaveTask}
          onClose={handleCloseTaskModal}
          onDelete={handleDeleteTask}
        />
      )}

      {showMemberModal && (
        <MemberModal
          members={members}
          editingMemberId={editingMemberId}
          memberUserId={memberUserId}
          memberRole={memberRole}
          memberError={memberError}
          savingMember={savingMember}
          deletingMemberId={deletingMemberId}
          onUserIdChange={setMemberUserId}
          onRoleChange={setMemberRole}
          onSubmit={handleSaveMember}
          onClose={handleCloseMemberModal}
          onDelete={handleDeleteMember}
        />
      )}
    </main>
  )
}
