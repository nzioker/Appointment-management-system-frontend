import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../utils/config'

export default function ProviderDashboard() {
  const [time, setTime] = useState('')
  const [appointments, setAppointments] = useState([])

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  const fetchAppointments = () => {
    axios
      .get(`${API_BASE_URL}/api/appointments/`, { withCredentials: true })
      .then((res) => setAppointments(res.data))
      .catch(() => alert('Failed to fetch appointments'))
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleAddSlot = async (e) => {
    e.preventDefault()
    const csrftoken = getCookie('csrftoken')
    axios
      .post(
        `${API_BASE_URL}/api/slots/create/`,
        { time },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
          },
        }
      )
      .then(() => {
        alert('Slot added!')
        setTime('')
      })
      .catch((error) => {
        console.error('Error response:', error.response?.data || error.message)
        alert('Slot creation failed')
      })
  }

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Provider Dashboard</h2>

      <form onSubmit={handleAddSlot} className='mb-6 space-y-3 max-w-md'>
        <label className='block'>
          <span className='font-semibold'>Add Available Slot:</span>
          <input
            type='datetime-local'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className='border w-full p-2 mt-1'
            required
          />
        </label>
        <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Add Slot
        </button>
      </form>

      <h3 className='text-xl font-bold mb-3'>Upcoming Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul className='space-y-2'>
          {appointments.map((appt) => (
            <li
              key={appt.id}
              className='border p-3 rounded flex justify-between items-center'
            >
              <div>
                <div className='font-semibold'>User: {appt.user}</div>
                <div className='text-gray-700'>
                  Time:{' '}
                  {new Date(appt.slot_time).toLocaleString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
