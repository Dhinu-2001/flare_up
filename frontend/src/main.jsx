import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from './redux/Store.jsx'
import { Provider } from 'react-redux'
import { env } from "@/utils/env";
import { GoogleOAuthProvider } from '@react-oauth/google'

import { getConfig } from './config';

let { VITE_googleOauthClientId } = getConfig();

VITE_googleOauthClientId = VITE_googleOauthClientId || env.VITE_googleOauthClientId



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

      <GoogleOAuthProvider clientId={VITE_googleOauthClientId}>
      
          <App />
        
      </GoogleOAuthProvider>

    </Provider>
  </StrictMode>,
)
