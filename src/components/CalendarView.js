// CalendarView.js
import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function CalendarView({ timeSlots, onSelectSlot }) {
  // Convert string slots to calendar event format
  const events = timeSlots.map((slot, i) => ({
    id: i,
    title: 'Available',
    start: new Date(slot),
    end: new Date(new Date(slot).getTime() + 30 * 60 * 1000), // 30 min duration
    allDay: false,
  }))

  return (
    <div
      className='mt-6 border rounded shadow bg-white p-4'
      style={{ height: 600 }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        defaultView='week'
        views={['day', 'week', 'agenda']}
        startAccessor='start'
        endAccessor='end'
        selectable
        step={30}
        timeslots={1}
        onSelectEvent={(event) => onSelectSlot(event.start)}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: '#34D399', // Tailwind green-400
            color: '#111827', // Tailwind gray-900
            borderRadius: '6px',
            border: '1px solid #10B981', // green-500 border
            paddingLeft: '4px',
          },
        })}
      />
    </div>
  )
}
