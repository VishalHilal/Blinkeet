import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {

  return (
    <section className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-4 py-6 grid lg:grid-cols-[240px_1fr] gap-6'>
        
        {/* Sidebar */}
        <aside className='hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-sm'>
          <UserMenu />
        </aside>

        {/* Main content */}
        <main className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[75vh] overflow-hidden'>
          <Outlet />
        </main>

      </div>
    </section>
  )
}

export default Dashboard
