import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useDashboard } from '../hooks/useDashboard'
import { useUsers } from '../hooks/useUsers'

import { AvatarModal } from '../components/avatar-modal/AvatarModal'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Textarea'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const navigate = useNavigate()

  const {
    projects,
    projectName,
    projectDescription,
    projectError,
    loading: projectsLoading,
    creatingProject,
    showProjectModal,
    error: projectsError,
    setProjectName,
    setProjectDescription,
    setShowProjectModal,
    handleCreateProject,
    handleCloseProjectModal,
    handleLogout,
  } = useDashboard()

  const {
    user,
    error: userError,
    loading: userLoading,
    handleAvatarChange,

    showUserModal,
    userName,
    userEmail,
    userUpdateError,
    updatingUser,
    setUserName,
    setUserEmail,
    handleOpenUserModal,
    handleCloseUserModal,
    handleUpdateUser,

    showAvatarModal,
    handleOpenAvatarModal,
    handleCloseAvatarModal,
  } = useUsers()

  const loading = projectsLoading || userLoading
  const error = projectsError || userError

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Carregando...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Não foi possível acessar o Dashboard
          </h1>

          <p className="mt-2 text-red-400">{error}</p>

          <Button
            type="button"
            onClick={() => navigate({ to: '/login' })}
            className="mt-6"
          >
            Ir para o login
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-400">
                  ?
                </div>
              )}
            </div>

            <div>
              <p className="text-lg font-semibold">{user?.name}</p>

              <p className="text-sm text-gray-400">{user?.email}</p>

              <button
                type="button"
                onClick={handleOpenUserModal}
                className="mt-1 text-sm text-gray-500 transition hover:text-white"
              >
                Editar perfil
              </button>
            </div>
          </div>

          <Button type="button" variant="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </header>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projetos</h2>

            <Button type="button" onClick={() => setShowProjectModal(true)}>
              Novo Projeto
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card className="mt-4 bg-gray-950 p-6">
              <p className="text-gray-400">
                Você ainda não possui nenhum projeto.
              </p>
            </Card>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  onClick={() =>
                    navigate({
                      to: '/projects/$id',
                      params: { id: project.id },
                    })
                  }
                  className={`cursor-pointer bg-gray-900 p-6 transition hover:border-gray-600 hover:bg-gray-800 ${
                    projects.length === 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <h3 className="text-lg font-semibold">{project.name}</h3>

                  {project.description && (
                    <p className="mt-2 text-sm text-gray-400">
                      {project.description}
                    </p>
                  )}

                  <p className="mt-4 text-xs text-gray-600">
                    Criado em{' '}
                    {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {showUserModal && (
        <Modal
          title="Editar perfil"
          onClose={handleCloseUserModal}
          disabled={updatingUser}
        >
          <form onSubmit={handleUpdateUser} className="space-y-5">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-gray-400">
                    ?
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenAvatarModal}
                disabled={updatingUser}
                className="mt-3"
              >
                Alterar foto
              </Button>
            </div>

            <div>
              <Label htmlFor="user-name">Nome</Label>

              <Input
                id="user-name"
                type="text"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="Seu nome"
                disabled={updatingUser}
              />
            </div>

            <div>
              <Label htmlFor="user-email">E-mail</Label>

              <Input
                id="user-email"
                type="email"
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
                placeholder="Seu e-mail"
                disabled={updatingUser}
              />
            </div>

            {userUpdateError && (
              <p className="text-sm text-red-400">{userUpdateError}</p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseUserModal}
                disabled={updatingUser}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={updatingUser}>
                {updatingUser ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {showAvatarModal && (
        <AvatarModal
          currentAvatar={user?.avatar ?? null}
          onConfirm={handleAvatarChange}
          onClose={handleCloseAvatarModal}
        />
      )}

      {showProjectModal && (
        <Modal
          title="Novo Projeto"
          onClose={handleCloseProjectModal}
          disabled={creatingProject}
        >
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <Label htmlFor="project-name">Nome</Label>

              <Input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Nome do projeto"
                autoFocus
                disabled={creatingProject}
              />
            </div>

            <div>
              <Label htmlFor="project-description">Descrição</Label>

              <Textarea
                id="project-description"
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="Descrição do projeto"
                rows={4}
                disabled={creatingProject}
              />
            </div>

            {projectError && (
              <p className="text-sm text-red-400">{projectError}</p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseProjectModal}
                disabled={creatingProject}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={creatingProject}>
                {creatingProject ? 'Criando...' : 'Criar projeto'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
