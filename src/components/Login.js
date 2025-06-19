import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../utils/config'
import { useNavigate } from 'react-router-dom'

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '', role: 'user' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/csrf/`, { withCredentials: true })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const csrftoken = getCookie('csrftoken')

      const res = await axios.post(`${API_BASE_URL}/api/auth/login/`, form, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrftoken,
        },
      })

      const { role } = res.data
      onLogin(role)

      if (role === 'provider') {
        navigate('/provider')
      } else {
        navigate('/user')
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        'Login failed. Check credentials and role.'
      setError(msg)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-sm mx-auto mt-10 space-y-3 p-4 border rounded'
    >
      <h2 className='text-xl font-bold'>Login</h2>

      {error && <div className='text-red-600 text-sm'>{error}</div>}

      <input
        name='username'
        placeholder='Username'
        className='border w-full p-2'
        onChange={handleChange}
        required
      />
      <input
        type='password'
        name='password'
        placeholder='Password'
        className='border w-full p-2'
        onChange={handleChange}
        required
      />
      <select
        name='role'
        value={form.role}
        onChange={handleChange}
        className='border w-full p-2'
        required
      >
        <option value='user'>User</option>
        <option value='provider'>Provider</option>
      </select>

      <button className='bg-blue-500 text-white px-4 py-2 rounded w-full'>
        Login
      </button>
    </form>
  )
}
