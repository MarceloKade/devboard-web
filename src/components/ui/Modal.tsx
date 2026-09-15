import type { ReactNode } from 'react'

type ModalProps = {
  title: string
  children: ReactNode
  onClose: () => void
  disabled?: boolean
}

export function Modal({
  title,
  children,
  onClose,
  disabled = false,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !disabled) {
          onClose()
        }
      }}
    >
      <div className="w-full max-w-lg rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={disabled}
            className="text-2xl leading-none text-gray-500 transition hover:text-white disabled:cursor-not-allowed"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
