import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

import type { ProjectMember } from '../../services/project-members.service'

type MemberListProps = {
  members: ProjectMember[]
  memberError: string
  canManageMembers: boolean
  onAddMember: () => void
  onEditMember: (member: ProjectMember) => void
}

export function MemberList({
  members,
  memberError,
  canManageMembers,
  onAddMember,
  onEditMember,
}: MemberListProps) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Membros</h2>

        <Button
          type="button"
          onClick={onAddMember}
          disabled={!canManageMembers}
        >
          Adicionar membro
        </Button>
      </div>

      {memberError && (
        <p className="mt-4 text-sm text-red-400">{memberError}</p>
      )}

      {members.length === 0 ? (
        <Card className="mt-4 bg-gray-950 p-6">
          <p className="text-gray-400">
            Este projeto ainda não possui membros.
          </p>
        </Card>
      ) : (
        <div className="mt-4 space-y-3">
          {members.map((member) => (
            <Card
              key={member.id}
              onClick={
                canManageMembers ? () => onEditMember(member) : undefined
              }
              className={`bg-gray-950 p-4 transition ${
                canManageMembers
                  ? 'cursor-pointer hover:border-gray-600 hover:bg-gray-800'
                  : 'opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
                    {member.user.avatar ? (
                      <img
                        src={member.user.avatar}
                        alt={`Avatar de ${member.user.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
                        ?
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-medium">{member.user.name}</p>

                    <p className="mt-1 text-sm text-gray-400">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400">
                  {member.role}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
