import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../utils/config'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'user',
    profession: '',
    contact: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Get CSRF cookie from backend
    axios.get(`${API_BASE_URL}/api/auth/csrf/`, {
      withCredentials: true,
    })
  }, [])

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const endpoint =
      form.role === 'provider'
        ? `${API_BASE_URL}/api/auth/signup-provider/`
        : `${API_BASE_URL}/api/auth/signup-user/`

    const payload =
      form.role === 'provider'
        ? {
            username: form.username,
            password: form.password,
            profession: form.profession,
            contact: form.contact,
          }
        : {
            username: form.username,
            password: form.password,
          }

    const csrftoken = getCookie('csrftoken')

    try {
      await axios.post(endpoint, payload, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrftoken,
        },
      })
      alert('Signup successful. You can now log in.')
      navigate('/login')
    } catch (err) {
      console.error(err.response || err)
      alert('Signup failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-md mx-auto mt-10 space-y-4 p-6 border rounded shadow'
    >
      <h2 className='text-2xl font-bold'>Sign Up</h2>

      <div>
        <label className='block mb-1 font-semibold'>Username</label>
        <input
          type='text'
          name='username'
          className='border w-full p-2 rounded'
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className='block mb-1 font-semibold'>Password</label>
        <input
          type='password'
          name='password'
          className='border w-full p-2 rounded'
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className='block mb-1 font-semibold'>Signup As</label>
        <select
          name='role'
          className='border w-full p-2 rounded'
          value={form.role}
          onChange={handleChange}
        >
          <option value='user'>User</option>
          <option value='provider'>Provider</option>
        </select>
      </div>

      {form.role === 'provider' && (
        <>
          <div>
            <label className='block mb-1 font-semibold'>Profession</label>
            <input
              type='text'
              name='profession'
              className='border w-full p-2 rounded'
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className='block mb-1 font-semibold'>Contact</label>
            <input
              type='text'
              name='contact'
              className='border w-full p-2 rounded'
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
        Sign Up
      </button>
    </form>
  )
}
