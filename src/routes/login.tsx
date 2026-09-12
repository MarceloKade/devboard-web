import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
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

        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Senha
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Sua senha"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-white px-4 py-3 font-medium text-gray-950 transition hover:bg-gray-200"
          >
            Entrar
          </button>
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
