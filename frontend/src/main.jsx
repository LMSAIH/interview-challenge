import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { WatchlistContextProvider } from './context/WatchlistContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <WatchlistContextProvider>
        <App />
      </WatchlistContextProvider>
    </AuthContextProvider>
  </StrictMode>
)
