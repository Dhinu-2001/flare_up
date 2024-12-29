'use client'
import AsideChatbox from '@/Page_components/Common/AsideChatbox'
import Header from '@/Page_components/Common/Header'

import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'



export default function UserHomeLayout() {

  return (<>
    {/* <div className="flex h-screen  bg-gray-900 text-white"> */}
    {/* <AsideChatbox />  */}

    <div className="flex flex-col min-h-screen relative overflow-hidden bg-black ">
      <Header />
      <Outlet />

    </div>

    {/* </div> */}
  </>
  )
}