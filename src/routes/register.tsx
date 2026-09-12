import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold">
            DevBoard
          </Link>

          <h1 className="mt-8 text-3xl font-bold">Criar conta</h1>

          <p className="mt-2 text-gray-400">
            Crie sua conta para começar a usar o DevBoard.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Nome
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-gray-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition placeholder:text-gray-600"
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
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none transition placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-white px-4 py-3 font-medium text-gray-950 transition hover:bg-gray-200"
          >
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Já possui uma conta?{' '}
          <Link to="/login" className="font-medium text-white hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
