import { useEffect, useState } from 'react'

import {
  addProjectMember,
  deleteProjectMember,
  getProjectMembers,
  updateProjectMember,
  type ProjectMember,
  type ProjectMemberRole,
} from '../services/project-members.service'

export function useProjectMembers(projectId: string) {
  const [members, setMembers] = useState<ProjectMember[]>([])

  const [showMemberModal, setShowMemberModal] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [memberUserId, setMemberUserId] = useState('')
  const [memberRole, setMemberRole] = useState<ProjectMemberRole>('MEMBER')
  const [memberError, setMemberError] = useState('')
  const [savingMember, setSavingMember] = useState(false)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)

  useEffect(() => {
    async function loadMembers() {
      try {
        const membersData = await getProjectMembers(projectId)

        setMembers(membersData)
      } catch (error) {
        setMemberError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar os membros.',
        )
      }
    }

    loadMembers()
  }, [projectId])

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
        const updatedMember = await updateProjectMember(
          projectId,
          editingMemberId,
          {
            role: memberRole,
          },
        )

        setMembers((currentMembers) =>
          currentMembers.map((member) =>
            member.id === updatedMember.id ? updatedMember : member,
          ),
        )
      } else {
        const member = await addProjectMember(projectId, {
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

      await deleteProjectMember(projectId, memberId)

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

  return {
    members,
    showMemberModal,
    editingMemberId,
    memberUserId,
    memberRole,
    memberError,
    savingMember,
    deletingMemberId,
    setMemberUserId,
    setMemberRole,
    handleOpenCreateMemberModal,
    handleOpenEditMemberModal,
    handleCloseMemberModal,
    handleSaveMember,
    handleDeleteMember,
  }
}
