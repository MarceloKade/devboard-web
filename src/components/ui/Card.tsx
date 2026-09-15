import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-lg border border-gray-800 bg-gray-900 ${className}`}
    />
  )
}
