export default function Navbar({ username, onLogout, onOpenModal }) {
  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        <div className='text-2xl font-extrabold text-indigo-600 tracking-wide select-none'>
          Appointment Management System
        </div>

        <div className='hidden sm:flex items-center space-x-6'>
          <span className='text-gray-700 text-lg'>
            Welcome, <span className='font-semibold'>{username}</span> 👋
          </span>

          <button
            onClick={onLogout}
            className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition duration-300 ease-in-out'
            aria-label='Logout'
            title='Logout'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
