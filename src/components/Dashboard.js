import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import { getCookie } from '../utils/csrf'
import { myBaseUrl } from '../utils/api'

export default function Dashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([])
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ provider: '', time: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)

  console.log('myBaseUrl:', myBaseUrl)
  useEffect(() => {
    axios.get(`${myBaseUrl}/api/csrf/`, { withCredentials: true })
  }, [])

  const fetchAppointments = () => {
    axios
      .get(`${myBaseUrl}/api/appointments/`, {
        withCredentials: true,
      })
      .then((res) => {
        setAppointments(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load appointments')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAppointments()

    axios
      .get(`${myBaseUrl}/api/providers/`, { withCredentials: true })
      .then((res) => setProviders(res.data))
      .catch(() => setError('Failed to load providers'))
  }, [])

  const handleProviderSelect = (e) => {
    const providerId = e.target.value
    setForm({ ...form, provider: providerId })
    setSelectedProvider(providerId)

    axios
      .get(`${myBaseUrl}/api/providers/${providerId}/timeslots/`, {
        withCredentials: true,
      })
      .then((res) => setTimeSlots(res.data))
      .catch(() => setError('Failed to load time slots'))
  }

  const handleAddAppointment = (e) => {
    e.preventDefault()
    const csrftoken = getCookie('csrftoken')
    axios
      .post(`${myBaseUrl}/api/appointments/`, form, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrftoken,
        },
      })
      .then(() => {
        setForm({ provider: '', time: '' })
        setSelectedProvider(null)
        setTimeSlots([])
        fetchAppointments()
      })
      .catch(() => alert('Failed to book appointment'))
  }

  //   const handleDelete = (id) => {
  //     const csrftoken = getCookie('csrftoken')
  //     axios
  //       .delete(`http://localhost:8000/api/appointments/${id}/`, {
  //         withCredentials: true,
  //         headers: {
  //           'X-CSRFToken': csrftoken,
  //         },
  //       })
  //       .then(() => fetchAppointments())
  //       .catch(() => alert('Failed to delete'))
  //   }

  const confirmDelete = (appointmentId) => {
    setAppointmentToDelete(appointmentId)
    setShowDeleteModal(true)
  }

  const performDelete = () => {
    const csrftoken = getCookie('csrftoken')

    axios
      .delete(`${myBaseUrl}/api/appointments/${appointmentToDelete}/`, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrftoken,
        },
      })
      .then(() => {
        fetchAppointments()
        setShowDeleteModal(false)
        setAppointmentToDelete(null)
      })
      .catch(() => alert('Failed to delete'))
  }

  return (
    <>
      <Navbar username={user.username} onLogout={onLogout} />

      <main className='p-6 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-semibold mb-6'>Book Appointment</h2>

        <form onSubmit={handleAddAppointment} className='mb-8 space-y-4'>
          <select
            value={form.provider}
            onChange={handleProviderSelect}
            className='w-full p-2 border rounded'
            required
          >
            <option value=''>Select a person</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {timeSlots.length > 0 && (
            <select
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className='w-full p-2 border rounded'
              required
            >
              <option value=''>Select a time slot</option>
              {timeSlots.map((slot, i) => (
                <option key={i} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          )}

          <button
            type='submit'
            className='bg-indigo-600 text-white px-4 py-2 rounded'
          >
            Book
          </button>
        </form>

        <h2 className='text-2xl font-semibold mb-4'>Your Appointments</h2>

        {loading && <p>Loading appointments...</p>}
        {error && <p className='text-red-600'>{error}</p>}
        {!loading && appointments.length === 0 && <p>No appointments yet.</p>}

        <ul className='space-y-4'>
          {appointments.map((appt) => (
            <li
              key={appt.id}
              className='border rounded p-4 bg-white shadow flex justify-between items-center'
            >
              <div>
                <h3 className='font-semibold'>{appt.provider_name}</h3>
                <p>{appt.time}</p>
              </div>
              <button
                onClick={() => confirmDelete(appt.id)}
                className='bg-red-500 text-white px-3 py-1 rounded'
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
      {showDeleteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-xl shadow-lg w-96 text-center'>
            <h3 className='text-lg font-semibold mb-4'>Confirm Deletion</h3>
            <p className='mb-6'>
              Are you sure you want to delete this appointment?
            </p>
            <div className='flex justify-center gap-4'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
