import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useProject } from '../../hooks/useProject'
import { useTasks } from '../../hooks/useTasks'
import { useProjectMembers } from '../../hooks/useProjectMembers'
import { useProjectActivities } from '../../hooks/useProjectActivities'
import { useUsers } from '../../hooks/useUsers'

import { ProjectHeader } from '../../components/projects/ProjectHeader'
import { ProjectForm } from '../../components/projects/ProjectForm'
import { TaskBoard } from '../../components/tasks/TaskBoard'
import { TaskModal } from '../../components/tasks/TaskModal'
import { MemberList } from '../../components/project-members/MemberList'
import { MemberModal } from '../../components/project-members/MemberModal'
import { ActivityModal } from '../../components/project-activities/ActivityModal'

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetails,
})

function ProjectDetails() {
  const navigate = useNavigate()
  const { id } = Route.useParams()

  const projectState = useProject(id)
  const taskState = useTasks(id)
  const memberState = useProjectMembers(id)
  const activityState = useProjectActivities(id)
  const userState = useUsers()

  if (projectState.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Carregando...</p>
      </main>
    )
  }

  if (projectState.error || !projectState.project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Não foi possível carregar o projeto
          </h1>

          <p className="mt-2 text-red-400">
            {projectState.error || 'Projeto não encontrado.'}
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

  const currentUserId = userState.user?.id

  const isOwner = projectState.project.ownerId === currentUserId

  const currentMember = memberState.members.find(
    (member) => member.user.id === currentUserId,
  )

  const isAdmin = isOwner || currentMember?.role === 'ADMIN'

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

        {projectState.editing ? (
          <ProjectForm
            projectName={projectState.projectName}
            projectDescription={projectState.projectDescription}
            updateError={projectState.updateError}
            updating={projectState.updating}
            onNameChange={projectState.setProjectName}
            onDescriptionChange={projectState.setProjectDescription}
            onSubmit={projectState.handleUpdateProject}
            onCancel={projectState.handleCancelEditing}
          />
        ) : (
          <>
            <ProjectHeader
              project={projectState.project}
              deleting={projectState.deleting}
              onEdit={projectState.handleStartEditing}
              onDelete={projectState.handleDeleteProject}
            />

            <div className="mt-4">
              <button
                type="button"
                onClick={activityState.handleOpenActivityModal}
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Ver atividades
              </button>
            </div>

            <TaskBoard
              tasks={taskState.tasks}
              draggingTaskId={taskState.draggingTaskId}
              taskError={taskState.taskError}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onOpenTask={taskState.handleOpenEditTaskModal}
              onDragStart={taskState.handleDragStart}
              onDragEnd={taskState.handleDragEnd}
              onDrop={taskState.handleDrop}
              onNewTask={taskState.handleOpenCreateTaskModal}
            />

            <MemberList
              members={memberState.members}
              memberError={memberState.memberError}
              canManageMembers={isAdmin}
              onAddMember={memberState.handleOpenCreateMemberModal}
              onEditMember={memberState.handleOpenEditMemberModal}
            />
          </>
        )}
      </div>

      {taskState.showTaskModal && (
        <TaskModal
          editingTaskId={taskState.editingTaskId}
          taskTitle={taskState.taskTitle}
          taskDescription={taskState.taskDescription}
          taskStatus={taskState.taskStatus}
          taskPriority={taskState.taskPriority}
          taskError={taskState.taskError}
          creatingTask={taskState.creatingTask}
          deletingTaskId={taskState.deletingTaskId}
          onTitleChange={taskState.setTaskTitle}
          onDescriptionChange={taskState.setTaskDescription}
          onStatusChange={taskState.setTaskStatus}
          onPriorityChange={taskState.setTaskPriority}
          onSubmit={taskState.handleSaveTask}
          onClose={taskState.handleCloseTaskModal}
          onDelete={taskState.handleDeleteTask}
        />
      )}

      {memberState.showMemberModal && (
        <MemberModal
          members={memberState.members}
          editingMemberId={memberState.editingMemberId}
          memberEmail={memberState.memberEmail}
          memberRole={memberState.memberRole}
          memberError={memberState.memberError}
          savingMember={memberState.savingMember}
          deletingMemberId={memberState.deletingMemberId}
          onEmailChange={memberState.setMemberEmail}
          onRoleChange={memberState.setMemberRole}
          onSubmit={memberState.handleSaveMember}
          onClose={memberState.handleCloseMemberModal}
          onDelete={memberState.handleDeleteMember}
        />
      )}

      {activityState.showActivityModal && (
        <ActivityModal
          activities={activityState.activities}
          loadingActivities={activityState.loadingActivities}
          activityError={activityState.activityError}
          onClose={activityState.handleCloseActivityModal}
        />
      )}
    </main>
  )
}
