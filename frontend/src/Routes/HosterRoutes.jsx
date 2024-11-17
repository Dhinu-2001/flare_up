import Analytics from '@/pages/HosterPages/Outlets/Analytics'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HosterHomeLayout from '@/pages/HosterPages/Layouts/HosterHomeLayout'
import CreateEvent from '@/pages/HosterPages/Outlets/CreateEvent'
import DashBoard from '@/pages/HosterPages/Outlets/DashBoard'
import ProfileHoster from '@/pages/HosterPages/Outlets/ProfileHoster'
import EventList from '@/pages/HosterPages/Outlets/EventList'
import PaymentList from '@/pages/HosterPages/Outlets/PaymentList'
import DataProvider from '@/ContextFiles/DataProvider'
import EventsDataProvider from '@/ContextFiles/EventsDataProvider'
import ProfileDataProvider from '@/ContextFiles/ProfileDataProvider'
import EventDetails from '@/pages/HosterPages/Outlets/EventDetails'
import UpdateOrganization from '@/pages/HosterPages/Outlets/UpdateOrganization'

function HosterRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HosterHomeLayout />} >
        <Route path="dashboard" element={
          <EventsDataProvider>
            <DashBoard />
          </EventsDataProvider>
        } />
        <Route path="create_event" element={
          <DataProvider>
            <CreateEvent />
          </DataProvider>} />

        <Route path="profile" element={
          <ProfileDataProvider>
            <ProfileHoster />
          </ProfileDataProvider>

        } />

<Route path="/organization/update_organization/" element={<UpdateOrganization />} />

        <Route path="events" element={
          <EventsDataProvider>
            <EventList />
          </EventsDataProvider>
        } />

        <Route path="/events/event/:event_id" element={<EventDetails />} />

        <Route path="payment_list" element={<PaymentList />} />
      </Route>
    </Routes>
  )
}

export default HosterRoutes
