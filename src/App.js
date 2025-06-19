import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom'
import { useState } from 'react'
import Login from './components/Login'
import UserDashboard from './components/UserDashboard'
import ProviderDashboard from './components/ProviderDashboard'
import Signup from './components/Signup'
import axios from 'axios'
import { API_BASE_URL } from './utils/config'
import { getCookie } from './utils/csrf'

export default function App() {
  const [role, setRole] = useState(null)

  const handleLogout = async () => {
    try {
      const csrftoken = getCookie('csrftoken')
      await axios.post(
        `${API_BASE_URL}/api/auth/logout/`,
        {},
        {
          headers: {
            'X-CSRFToken': csrftoken,
          },
          withCredentials: true,
        }
      )
      setRole(null)
    } catch (err) {
      console.error('Logout error:', err.response || err)
      alert('Logout failed')
    }
  }

  // ✅ Component to guard routes
  const ProtectedRoute = ({ children, allowed }) => {
    if (!role) return <Navigate to='/login' replace />
    if (role !== allowed) return <Navigate to='/' replace />
    return children
  }

  return (
    <Router>
      <nav className='bg-gray-800 text-white p-4 flex space-x-4'>
        {/* <Link to='/' className='hover:underline'>
          Home
        </Link> */}
        {!role && (
          <>
            <Link to='/login' className='hover:underline'>
              Login
            </Link>
            <Link to='/signup' className='hover:underline'>
              Sign Up
            </Link>
          </>
        )}
        {role === 'user' && (
          <Link to='/user' className='hover:underline'>
            User Dashboard
          </Link>
        )}
        {role === 'provider' && (
          <Link to='/provider' className='hover:underline'>
            Provider Dashboard
          </Link>
        )}
        {role && (
          <button onClick={handleLogout} className='hover:underline'>
            Logout
          </button>
        )}
      </nav>

      <Routes>
        <Route
          path='/'
          element={<div className='p-4 text-xl'>Welcome! Please log in.</div>}
        />
        <Route path='/login' element={<Login onLogin={setRole} />} />
        <Route path='/signup' element={<Signup />} />

        {/* 🔐 Role-based protected routes */}
        <Route
          path='/user'
          element={
            <ProtectedRoute allowed='user'>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/provider'
          element={
            <ProtectedRoute allowed='provider'>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
