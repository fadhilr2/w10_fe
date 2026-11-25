import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:3000/tasks'

type Task = {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  done: boolean
}

type Stats = {
  total: number
  done: number
  notDone: number
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, done: 0, notDone: 0 })

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  async function loadTasks() {
    const res = await fetch(API_URL)
    setTasks(await res.json())

    const statsRes = await fetch(API_URL + '/stats')
    setStats(await statsRes.json())
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function addTask(e: React.FormEvent) {
    e.preventDefault() 
    if (title.trim() === '') return

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority }),
    })

    setTitle('') 
    loadTasks()
  }

  async function toggleDone(task: Task) {
    await fetch(API_URL + '/' + task.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done }),
    })
    loadTasks()
  }

  async function deleteTask(id: string) {
    await fetch(API_URL + '/' + id, { method: 'DELETE' })
    loadTasks()
  }

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <h1 className="mb-4">My Tasks</h1>

      <div className="mb-4">
        <span className="badge bg-secondary me-2">Total: {stats.total}</span>
        <span className="badge bg-success me-2">Done: {stats.done}</span>
        <span className="badge bg-warning text-dark">Not done: {stats.notDone}</span>
      </div>

      <form className="d-flex gap-2 mb-4" onSubmit={addTask}>
        <input
          className="form-control"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="form-select"
          style={{ width: 130 }}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      {tasks.length === 0 && <p className="text-muted">No tasks yet.</p>}

      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex align-items-center gap-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={task.done}
              onChange={() => toggleDone(task)}
            />
            <span className={task.done ? 'text-decoration-line-through text-muted' : ''}>
              {task.title}
            </span>
            <span className="badge bg-info text-dark ms-auto">{task.priority}</span>
            <button className="btn btn-sm btn-danger" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
