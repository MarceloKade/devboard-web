import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

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
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Membros</h2>

        <Button type="button" onClick={onAddMember}>
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
              onClick={() => onEditMember(member)}
              className="cursor-pointer bg-gray-950 p-4 transition hover:border-gray-600 hover:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{member.user.name}</p>

                  <p className="mt-1 text-sm text-gray-400">
                    {member.user.email}
                  </p>
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
