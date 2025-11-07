import { useEffect, useState } from 'react'
import './App.css'

type User = {
  id: number
  name: string
}

function App() {
  const apiBaseUrl = "/backend"

  const [users, setUsers] = useState<User[]>([])
  const [nameInput, setNameInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadUsers() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBaseUrl}/users`)
      if (!res.ok) throw new Error(`Failed to load users (${res.status})`)
      const data: User[] = await res.json()
      setUsers(data)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function addUser(name: string) {
    setError(null)
    try {
      const res = await fetch(`${apiBaseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      if (!res.ok) throw new Error(`Failed to add user (${res.status})`)
      const created: User = await res.json()
      setUsers((prev) => [created, ...prev])
      setNameInput('')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      setError(message)
    }
  }

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>Users</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!nameInput.trim()) return
          addUser(nameInput.trim())
        }}
        style={{ display: 'flex', gap: 8, marginBottom: 16 }}
      >
        <input
          type="text"
          placeholder="Enter name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && (
        <p style={{ color: 'crimson', marginBottom: 12 }}>
          {error}
        </p>
      )}

      {!loading && users.length === 0 && <p>No users yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {users.map((u) => (
          <li
            key={u.id}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e5e5',
              borderRadius: 6,
              marginBottom: 8
            }}
          >
            {u.name}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 24, fontSize: 12, color: '#666' }}>
        API: {apiBaseUrl}
      </div>
    </div>
  )
}

export default App
