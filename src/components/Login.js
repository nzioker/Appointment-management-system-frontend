import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getCookie } from '../utils/csrf'
import { myBaseUrl } from '../utils/api'

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Pre-fetch CSRF cookie
    axios.get(`${myBaseUrl}/api/csrf/`, { withCredentials: true })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const csrftoken = getCookie('csrftoken')

    try {
      // Step 1: Login
      await axios.post(
        `${myBaseUrl}/api/auth/login/`,
        { username, password },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
          },
        }
      )

      // Step 2: Fetch user info after login
      const res = await axios.get(`${myBaseUrl}/api/auth/user/`, {
        withCredentials: true,
      })

      // Step 3: Update App state with user info
      onLogin(res.data)
    } catch (error) {
      console.error('Login error:', error.response || error.message)
      alert('Login failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='p-6 bg-white rounded-2xl shadow-xl w-80'
    >
      <h2 className='text-xl font-bold mb-4 text-gray-800'>Login</h2>
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className='w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none'
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none'
      />
      <button
        type='submit'
        className='w-full py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700'
      >
        Login
      </button>
    </form>
  )
}
