import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex h-20 items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            DevBoard
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 transition hover:bg-gray-200"
          >
            Entrar
          </Link>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <span className="mb-6 rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-400">
            Gerencie seus projetos de forma simples
          </span>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
            Organize seus projetos e tarefas em um só lugar.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            O DevBoard é uma plataforma para organizar projetos, acompanhar
            tarefas e trabalhar em equipe.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-white px-6 py-3 font-medium text-gray-950 transition hover:bg-gray-200"
            >
              Começar agora
            </Link>
          </div>
        </section>

        <section
          id="sobre"
          className="border-t border-gray-800 py-16 text-center"
        >
          <h2 className="text-2xl font-bold">Tudo organizado</h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Crie projetos, gerencie tarefas e acompanhe os membros da sua
            equipe.
          </p>
        </section>
      </div>
    </main>
  )
}
