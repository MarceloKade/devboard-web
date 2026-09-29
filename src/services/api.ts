const API_URL = import.meta.env.VITE_API_URL

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = localStorage.getItem('accessToken')

  const headers: HeadersInit = {
    ...(accessToken && {
      Authorization: `Bearer ${accessToken}`,
    }),
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)

    throw new Error(error?.message || 'Erro ao realizar a requisição.')
  }

  return response.json()
}
