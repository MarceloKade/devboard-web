import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-white text-gray-950 hover:bg-gray-200',
    secondary: 'border border-gray-700 hover:bg-gray-800',
    danger: 'border border-red-900 text-red-400 hover:bg-red-950',
  }

  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    />
  )
}
