import { useState } from 'react'

import {
  getProjectActivities,
  type ProjectActivity,
} from '../services/project-activities.service'

export function useProjectActivities(projectId: string) {
  const [activities, setActivities] = useState<ProjectActivity[]>([])
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(false)
  const [activityError, setActivityError] = useState('')

  async function handleOpenActivityModal() {
    setActivityError('')
    setLoadingActivities(true)
    setShowActivityModal(true)

    try {
      const activitiesData = await getProjectActivities(projectId)

      setActivities(activitiesData)
    } catch (error) {
      setActivityError(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar as atividades.',
      )
    } finally {
      setLoadingActivities(false)
    }
  }

  function handleCloseActivityModal() {
    if (loadingActivities) {
      return
    }

    setShowActivityModal(false)
    setActivityError('')
  }

  return {
    activities,
    showActivityModal,
    loadingActivities,
    activityError,
    handleOpenActivityModal,
    handleCloseActivityModal,
  }
}
