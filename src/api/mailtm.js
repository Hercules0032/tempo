// Thin client for the free, key-less, CORS-enabled mail.tm API.
// Docs: https://docs.mail.tm
const BASE = 'https://api.mail.tm'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 429) {
    throw new Error('Rate limited by mail.tm — wait a few seconds and retry.')
  }
  if (!res.ok) {
    let detail = ''
    try {
      const data = await res.json()
      detail = data['hydra:description'] || data.message || ''
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Request failed (${res.status})`)
  }
  if (res.status === 204) return null
  return res.json()
}

const rand = (len) =>
  Array.from({ length: len }, () =>
    'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
  ).join('')

// Returns the first active domain offered by mail.tm
export async function getDomain() {
  const data = await request('/domains?page=1')
  const domains = data['hydra:member'].filter((d) => d.isActive)
  if (!domains.length) throw new Error('No active mail domains available.')
  return domains[0].domain
}

// Creates a brand new disposable account + auth token.
export async function createAccount() {
  const domain = await getDomain()
  const address = `${rand(10)}@${domain}`
  const password = rand(16)

  await request('/accounts', { method: 'POST', body: { address, password } })
  const { token, id } = await request('/token', {
    method: 'POST',
    body: { address, password },
  })

  return { address, password, token, id }
}

// Re-authenticate using a saved address + password (after refresh).
export async function login(address, password) {
  const { token, id } = await request('/token', {
    method: 'POST',
    body: { address, password },
  })
  return { token, id }
}

export async function getMessages(token) {
  const data = await request('/messages?page=1', { token })
  return data['hydra:member']
}

export async function getMessage(id, token) {
  return request(`/messages/${id}`, { token })
}

export async function deleteMessage(id, token) {
  return request(`/messages/${id}`, { method: 'DELETE', token })
}
