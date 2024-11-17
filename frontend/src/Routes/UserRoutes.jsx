import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import OTPPage from '../pages/OTPPage'
import HosterRegister from '../Page_components/Register/HosterRegister'
import UserHomeLayout from '../pages/UserPages/Layouts/UserHomeLayout'
import Home from '../pages/UserPages/Outlets/Home'
import Categories from '@/pages/UserPages/Outlets/Categories'
import EventList from '@/pages/UserPages/Outlets/EventList'
import DataProvider from '@/ContextFiles/DataProvider'
import EventDetails from '@/pages/UserPages/Outlets/EventDetails'
import EventsDataProvider from '@/ContextFiles/EventsDataProvider'

function UserRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/hoster_register" element={<HosterRegister />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp_verification" element={<OTPPage />} />

      <Route path="/" element={<UserHomeLayout />}>
        <Route path="/" element={
          <EventsDataProvider>
            <Home />
          </EventsDataProvider>
        }></Route>

        <Route path="categories" element={
          <DataProvider>
            <Categories />
          </DataProvider>}>
        </Route>

        <Route path="/catgory/:category_name" element={<EventList />}></Route>
        <Route path="/catgory/:category_name/:type_name/:event_id/" element={<EventDetails />}></Route>

      </Route>
    </Routes>
  )
}

export default UserRoutes
