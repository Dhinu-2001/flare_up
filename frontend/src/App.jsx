import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import UserHomePage from './pages/UserPages/Layouts/UserHomeLayout'

import EventAnalyticsDashboard from './Page_components/HosterHome/HosterHome'
import HosterHomePage from './pages/HosterPages/Layouts/HosterHomeLayout'
import DashboardPage from './pages/AdminPages/DashboardPage'
import Analytics from './pages/HosterPages/Outlets/Analytics'
import UserRoutes from './Routes/UserRoutes'
import HosterRoutes from './Routes/HosterRoutes'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/Store.jsx'
import AdminRoutes from './Routes/AdminRoutes'
import { Toaster } from 'sonner'

function App() {

  return (
    <div>
      <PersistGate loading={null} persistor={persistor} >
        <Router>
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="/hoster/*" element={<HosterRoutes />} />
            <Route exact path="/admin/*" element={<AdminRoutes />} />

            {/* <Route exact path="/map" element={<ConcertMap/>} /> */}
          </Routes>
        </Router>
        <Toaster position="top-right" expand={true} closeButton  richColors />
      </PersistGate>
    </div>
  )
}

export default App
