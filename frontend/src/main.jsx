import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from './redux/Store.jsx'
import { Provider } from 'react-redux'
import { env } from "@/utils/env";


import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

      <GoogleOAuthProvider clientId={env.VITE_googleOauthClientId}>
      
          <App />
        
      </GoogleOAuthProvider>

    </Provider>
  </StrictMode>,
)
