import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

import { api } from '../services/api'
import { setAccessToken } from '../services/auth.service'

import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'

export const Route = createFileRoute('/login')({
  component: Login,
})

type LoginResponse = {
  accessToken: string
}

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = await api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      setAccessToken(data.accessToken)

      navigate({ to: '/dashboard' })
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Erro ao realizar o login.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold">
            DevBoard
          </Link>

          <h1 className="mt-8 text-3xl font-bold">Entrar</h1>

          <p className="mt-2 text-gray-400">Acesse sua conta para continuar.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">E-mail</Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Ainda não possui uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-white hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  )
}
