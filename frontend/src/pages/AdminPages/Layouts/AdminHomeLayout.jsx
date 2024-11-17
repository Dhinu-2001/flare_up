import AsideChatbox from '@/Page_components/Common/AsideChatbox'
import Header from '@/Page_components/Common/Header'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

'use client'

import { useState, useEffect } from 'react'
// import { Line } from 'react-chartjs-2'
// import { 
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend
// } from 'chart.js'
import { Bell, Home, Search, Settings } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AsideBar from '@/Page_components/Admin/AsideBar'

function AdminHomeLayout() {

  const navigate = useNavigate()
  const authenticateStateValue = useSelector((store) => store.isAuthenticated)
  const roleValue = useSelector((store) => store.role)


  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])


  // useEffect(() => {

  //   if (authenticateStateValue == true) {
  //     if (roleValue == 'hoster') {
  //       navigate('/hoster')
  //     } else if (roleValue == 'admin') {
  //       navigate('/admin_dashboard')
  //     } else if (roleValue == 'user') {
  //       navigate('/')
  //     }
  //   } else {
  //     navigate('/login')
  //   }

  // }, [])

  return (
    // <div className='flex h-screen bg-stone-900 text-white'>
    //   <AsideChatbox/>
    //   <div className="flex-1 flex flex-col overflow-hidden">
    //     <Header/>
    //     <div className="flex-1 flex h-screen"> 
    //       <Outlet/>
    //     </div>
    //   </div>
    // </div>

    <div className=" min-h-screen bg-gradient-to-tl from-stone-800 to-black ">
      <Header />
      <AsideBar />

      {/* Main Content */}
      <div className={`transition-margin duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Header */}
        <header className=" p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-black">

              <Home className="h-4 w-4" />
              <span>/</span>
              <span>Dashboard</span>
            </div>
            {/* <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input className="pl-10" placeholder="Type here..." />
              </div>
              <Button variant="ghost" className="text-white">
                Sign in
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <Bell className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>

  )
}

export default AdminHomeLayout
