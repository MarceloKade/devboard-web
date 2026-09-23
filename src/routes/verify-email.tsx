import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { api } from '../services/api'

import { Button } from '../components/ui/Button'

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmail,
})

function VerifyEmail() {
  const [message, setMessage] = useState('Confirmando seu e-mail...')
  const [error, setError] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    async function verifyEmail() {
      const token = new URLSearchParams(window.location.search).get('token')

      if (!token) {
        setMessage('Token de verificação não encontrado.')
        setError(true)
        return
      }

      try {
        const data = await api<{ message: string }>(
          `/auth/verify-email?token=${encodeURIComponent(token)}`,
        )

        setMessage(data.message)
        setVerified(true)
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível verificar seu e-mail.',
        )
        setError(true)
      }
    }

    verifyEmail()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="text-2xl font-bold">
          DevBoard
        </Link>

        <div className="mt-12">
          <h1 className="text-3xl font-bold">
            {error ? 'Erro na verificação' : 'Verificação de e-mail'}
          </h1>

          <p className="mt-4 text-gray-400">{message}</p>

          {verified && (
            <Link to="/login" className="mt-8 inline-block">
              <Button>Ir para o login</Button>
            </Link>
          )}

          {error && (
            <Link to="/login" className="mt-8 inline-block">
              <Button variant="secondary">Voltar para o login</Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
