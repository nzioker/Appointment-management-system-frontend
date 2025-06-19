import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getCookie } from '../utils/csrf'
import { myBaseUrl } from '../utils/api'

export default function ProviderForm({ onProviderAdded }) {
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')

  useEffect(() => {
    axios.get(`${myBaseUrl}/api/csrf/`, { withCredentials: true })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const csrftoken = getCookie('csrftoken')

    try {
      const res = await axios.post(
        `${myBaseUrl}/api/providers/create/`,
        { name, profession },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
          },
        }
      )
      alert('Provider created successfully!')
      if (onProviderAdded) onProviderAdded(res.data)
      setName('')
      setProfession('')
    } catch (error) {
      console.error('Provider creation error:', error.response || error.message)
      alert('Failed to create provider')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='p-6 bg-white rounded-2xl shadow-xl w-80'
    >
      <h2 className='text-xl font-bold mb-4 text-gray-800'>
        Add Service Provider
      </h2>
      <input
        type='text'
        placeholder='Provider Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none'
      />
      <input
        type='text'
        placeholder='Profession'
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        className='w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none'
      />
      <button
        type='submit'
        className='w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700'
      >
        Register Provider
      </button>
    </form>
  )
}
