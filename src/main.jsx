import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// import App from './AppL.jsx' // Aplikacja Leaflet
import App from './AppG.jsx' // Aplikacja Google Maps
// import AppM from './AppM.jsx' // Aplikacja MapLibre

const ActiveApp = App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Renderujemy wybraną aplikację */}
    <ActiveApp />
  </React.StrictMode>,
)