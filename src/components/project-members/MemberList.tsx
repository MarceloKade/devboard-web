import type { ProjectMember } from '../../services/project-members.service'

type MemberListProps = {
  members: ProjectMember[]
  memberError: string
  onAddMember: () => void
  onEditMember: (member: ProjectMember) => void
}

export function MemberList({
  members,
  memberError,
  onAddMember,
  onEditMember,
}: MemberListProps) {
  return (
    <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Membros</h2>

        <button
          type="button"
          onClick={onAddMember}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 transition hover:bg-gray-200"
        >
          Adicionar membro
        </button>
      </div>

      {memberError && (
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
              onClick={() => onEditMember(member)}
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
  )
}
