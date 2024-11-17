import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from './redux/Store.jsx'
import { Provider } from 'react-redux'


import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

      <GoogleOAuthProvider clientId='837006381197-ntpeojnppdcu0g5j01enk4gm8spaimfm.apps.googleusercontent.com'>
      
          <App />
        
      </GoogleOAuthProvider>

    </Provider>
  </StrictMode>,
)
