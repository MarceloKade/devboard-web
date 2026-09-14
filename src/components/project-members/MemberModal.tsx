import type {
  ProjectMember,
  ProjectMemberRole,
} from '../../services/project-members.service'

type MemberModalProps = {
  members: ProjectMember[]
  editingMemberId: string | null
  memberUserId: string
  memberRole: ProjectMemberRole
  memberError: string
  savingMember: boolean
  deletingMemberId: string | null
  onUserIdChange: (value: string) => void
  onRoleChange: (value: ProjectMemberRole) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
  onDelete: (memberId: string) => void
}

export function MemberModal({
  members,
  editingMemberId,
  memberUserId,
  memberRole,
  memberError,
  savingMember,
  deletingMemberId,
  onUserIdChange,
  onRoleChange,
  onSubmit,
  onClose,
  onDelete,
}: MemberModalProps) {
  const editingMember = members.find((member) => member.id === editingMemberId)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
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
            onClick={onClose}
            disabled={savingMember || !!deletingMemberId}
            className="text-2xl leading-none text-gray-500 transition hover:text-white disabled:cursor-not-allowed"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
                onChange={(event) => onUserIdChange(event.target.value)}
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
              <p className="font-medium">{editingMember?.user.name}</p>

              <p className="mt-1 text-sm text-gray-400">
                {editingMember?.user.email}
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
                onRoleChange(event.target.value as ProjectMemberRole)
              }
              disabled={savingMember || !!deletingMemberId}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {memberError && <p className="text-sm text-red-400">{memberError}</p>}

          <div className="flex items-center justify-between gap-3">
            {editingMemberId ? (
              <button
                type="button"
                onClick={() => onDelete(editingMemberId)}
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
                onClick={onClose}
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
  )
}
