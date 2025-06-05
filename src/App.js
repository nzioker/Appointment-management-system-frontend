import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { getCookie } from '../src/utils/csrf'
import { myBaseUrl } from './utils/api'
axios.defaults.withCredentials = true

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Fetch CSRF cookie on app load
    axios
      .get(`${myBaseUrl}/api/csrf/`, { withCredentials: true })
      .then(() => {
        console.log('CSRF cookie set')

        // Set axios global CSRF header
        axios.defaults.withCredentials = true
        axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken')

        // Fetch user info after CSRF is ready
        axios
          .get(`${myBaseUrl}/api/auth/user/`)
          .then((res) => {
            setUser(res.data)
            setIsAuthenticated(true)
          })
          .catch(() => {
            setUser(null)
            setIsAuthenticated(false)
          })
      })
      .catch((err) => {
        console.error('Failed to get CSRF cookie:', err)
      })
  }, [])

  const handleLogout = () => {
    axios
      .post(`${myBaseUrl}/api/auth/logout/`, {})
      .then(() => {
        setUser(null)
        setIsAuthenticated(false)
      })
      .catch((err) => {
        console.error('Logout error:', err)
      })
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200'>
      {isAuthenticated && user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <div className='flex flex-col items-center justify-center h-screen space-y-8'>
          <Login
            onLogin={(user) => {
              setIsAuthenticated(true)
              setUser(user)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default App
