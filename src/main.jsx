import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// import App from './AppL.jsx' // Leaflet
// import App from './AppG.jsx' // Google Maps
import App from './AppM.jsx' // MapLibre

const ActiveApp = App;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ActiveApp />
    </React.StrictMode>,
)