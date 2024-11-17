import AsideChatbox from '@/Page_components/Common/AsideChatbox'
import CardComponent from '@/Page_components/Common/CardComponent'
import Header from '@/Page_components/Common/Header'
import MapComponent from '@/Page_components/Common/MapComponent'
import React from 'react'
import HostSideBar from '@/Page_components/HosterHome/Common/HostSideBar'
import DashboardCard from '@/Page_components/HosterHome/Common/DashboardCard'
import { Calendar, Ticket, PersonStanding, Coins } from 'lucide-react'
import TableEvent from '@/Page_components/HosterHome/Dashboard/TableEvent'
import ChartAnalytics from '@/Page_components/HosterHome/Dashboard/ChartAnalytics'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

function DashboardPage() {

    const navigate = useNavigate()
  const authenticateStateValue = useSelector((store)=>store.isAuthenticated)
  const roleValue = useSelector((store)=>store.role)

  useEffect(()=>{
    
    if(authenticateStateValue == true){
      if(roleValue == 'hoster'){
        navigate('/hoster_home')
      }else if(roleValue == 'admin'){
        navigate('/admin_dashboard')
      }else if(roleValue == 'user'){
        navigate('/')
      }
    }else{
      navigate('/login')
    }

  },[])


  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      <AsideChatbox/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header/>
        <div className="flex-1 flex h-screen">
          <div className=' hidden md:block '>
            <HostSideBar/>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
           
            <h2 className=' text-purple-400 font-bold text-2xl pt-3 pl-3'>Analytics</h2>
            <div className='p-3 bg-gray-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <DashboardCard title={'Event'} description={'Total events hosted'} icon={<Calendar className="h-4 w-4 text-pink-500" />} value={'107'}/>
              <DashboardCard title={'Tickets'} description={'Total tickets sold'} icon={<Ticket className="h-4 w-4 text-pink-500" />} value={'2159'}/>
              <DashboardCard title={'Attendees'} description={'Total attendees'} icon={<PersonStanding className="h-4 w-4 text-pink-500" />} value={'2093'}/>
              <DashboardCard title={'Revenue'} description={'Total revenue'} icon={<Coins className="h-4 w-4 text-pink-500" />} value={'Rs. 1,09,399'}/>
            </div>
            <div className='p-3'>
              <ChartAnalytics />
            </div>
            <div className='mt-2'>
              <h2 className=' text-purple-400 font-bold text-2xl px-3'>Events</h2>
              <div>
              <TableEvent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
