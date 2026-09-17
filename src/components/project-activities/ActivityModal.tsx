import { Modal } from '../ui/Modal'

import type { ProjectActivity } from '../../services/project-activities.service'

type ActivityModalProps = {
  activities: ProjectActivity[]
  loadingActivities: boolean
  activityError: string
  onClose: () => void
}

export function ActivityModal({
  activities,
  loadingActivities,
  activityError,
  onClose,
}: ActivityModalProps) {
  return (
    <Modal title="Atividades do projeto" onClose={onClose}>
      {loadingActivities ? (
        <p className="text-sm text-gray-400">Carregando atividades...</p>
      ) : activityError ? (
        <p className="text-sm text-red-400">{activityError}</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-400">
          Este projeto ainda não possui atividades.
        </p>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-0">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex w-4 shrink-0 flex-col items-center">
                  <div className="mt-1 h-3 w-3 rounded-full bg-white" />

                  {index < activities.length - 1 && (
                    <div className="h-full w-px bg-gray-700" />
                  )}
                </div>

                <div className="pb-6">
                  <p className="font-medium text-white">{activity.user.name}</p>

                  <p className="mt-1 text-sm text-gray-300">
                    {activity.message}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
