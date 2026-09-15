import type { LabelHTMLAttributes } from 'react'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ className = '', ...props }: LabelProps) {
  return (
    <label
      {...props}
      className={`mb-2 block text-sm font-medium text-gray-300 ${className}`}
    />
  )
}
