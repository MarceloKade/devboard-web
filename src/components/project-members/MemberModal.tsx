import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'

import type {
  ProjectMember,
  ProjectMemberRole,
} from '../../services/project-members.service'

type MemberModalProps = {
  members: ProjectMember[]
  editingMemberId: string | null
  memberEmail: string
  memberRole: ProjectMemberRole
  memberError: string
  savingMember: boolean
  deletingMemberId: string | null
  onEmailChange: (value: string) => void
  onRoleChange: (value: ProjectMemberRole) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
  onDelete: (memberId: string) => void
}

export function MemberModal({
  members,
  editingMemberId,
  memberEmail,
  memberRole,
  memberError,
  savingMember,
  deletingMemberId,
  onEmailChange,
  onRoleChange,
  onSubmit,
  onClose,
  onDelete,
}: MemberModalProps) {
  const editingMember = members.find((member) => member.id === editingMemberId)

  const disabled = savingMember || !!deletingMemberId

  return (
    <Modal
      title={editingMemberId ? 'Editar membro' : 'Adicionar membro'}
      onClose={onClose}
      disabled={disabled}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {!editingMemberId && (
          <div>
            <Label htmlFor="member-email">E-mail</Label>

            <Input
              id="member-email"
              type="email"
              value={memberEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="usuario@email.com"
              autoFocus
              disabled={disabled}
            />

            <p className="mt-2 text-xs text-gray-500">
              Informe o e-mail do usuário que deseja adicionar ao projeto.
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
          <Label htmlFor="member-role">Role</Label>

          <Select
            id="member-role"
            value={memberRole}
            onChange={(event) =>
              onRoleChange(event.target.value as ProjectMemberRole)
            }
            disabled={disabled}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </Select>
        </div>

        {memberError && <p className="text-sm text-red-400">{memberError}</p>}

        <div className="flex items-center justify-between gap-3">
          {editingMemberId ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => onDelete(editingMemberId)}
              disabled={disabled}
            >
              {deletingMemberId === editingMemberId
                ? 'Removendo...'
                : 'Remover membro'}
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={disabled}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={disabled}>
              {savingMember
                ? editingMemberId
                  ? 'Salvando...'
                  : 'Adicionando...'
                : editingMemberId
                  ? 'Salvar alterações'
                  : 'Adicionar membro'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
