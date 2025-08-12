import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {

  return (
    <section className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-4 py-6 grid lg:grid-cols-[250px_1fr] gap-6'>
        
        {/* Sidebar */}
        <aside className='hidden lg:block sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto border-r border-gray-200 bg-white rounded-lg shadow-sm'>
          <div className='p-4'>
            <UserMenu />
          </div>
        </aside>

        {/* Main content */}
        <main className='bg-white rounded-lg shadow-sm p-4 min-h-[75vh]'>
          <Outlet />
        </main>

      </div>
    </section>
  )
}

export default Dashboard
