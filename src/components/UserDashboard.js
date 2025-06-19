import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../utils/config'

export default function UserDashboard() {
  const [providers, setProviders] = useState([])
  const [slots, setSlots] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/providers/`)
      .then((res) => setProviders(res.data))
      .catch(() => alert('Failed to load providers'))
  }, [])

  const fetchSlots = (providerId) => {
    console.log('Fetching slots for provider:', providerId)
    setSelectedProvider(providerId)
    axios
      .get(`${API_BASE_URL}/api/slots/`, {
        params: { provider_id: providerId },
        withCredentials: true,
      })
      .then((res) => {
        console.log('Slots:', res.data)
        setSlots(res.data)
      })
      .catch((err) => {
        console.error(err)
        alert('Failed to load slots')
      })
  }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  const bookSlot = (slotId) => {
    const csrftoken = getCookie('csrftoken')
    axios
      .post(
        `${API_BASE_URL}/api/appointments/create/`,
        { slot_id: slotId },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
          },
        }
      )
      .then(() => alert('Appointment booked successfully!'))
      .catch(() => alert('Booking failed'))
  }

  const groupedSlots = slots.reduce((acc, slot) => {
    const date = new Date(slot.time).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(slot)
    return acc
  }, {})

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Available Providers</h2>
      <ul className='space-y-2'>
        {providers.map((p) => (
          <li
            key={p.id}
            className='border p-3 rounded flex justify-between items-center'
          >
            <div>
              <div className='font-semibold'>{p.user?.username}</div>
              <div className='text-sm text-gray-600'>{p.profession}</div>
            </div>
            <button
              className='bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'
              onClick={() => fetchSlots(p.id)}
            >
              View Slots
            </button>
          </li>
        ))}
      </ul>

      {selectedProvider && slots.length > 0 && (
        <div className='mt-8'>
          <h3 className='text-xl font-bold mb-4'>Available Time Slots</h3>
          {Object.entries(groupedSlots).map(([date, daySlots]) => (
            <div key={date} className='mb-6'>
              <h4 className='text-lg font-semibold mb-2'>{date}</h4>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
                {daySlots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={slot.booked}
                    onClick={() => !slot.booked && bookSlot(slot.id)}
                    className={`px-3 py-2 rounded text-white ${
                      slot.booked
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {new Date(slot.time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
