import React, { useState } from 'react';
import AppL from './AppL.jsx';
import AppG from './AppG.jsx';
import AppM from './AppM.jsx';

const MAP_OPTIONS = [
    { id: 'L', name: 'Leaflet (Raster)', Component: AppL },
    { id: 'G', name: 'Google Maps', Component: AppG },
    { id: 'M', name: 'MapLibre (Vector)', Component: AppM },
];

function AppSwitcher() {
    const [activeAppId, setActiveAppId] = useState('M');
    
    const ActiveAppComponent = MAP_OPTIONS.find(opt => opt.id === activeAppId)?.Component;

    return (
        <div style={{ padding: '0px' }}>
            <div style={{ padding: '15px'}}>
                <h2>Geo-App Prototype</h2>
                {MAP_OPTIONS.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setActiveAppId(opt.id)}
                        disabled={activeAppId === opt.id}
                        style={{ margin: '0 10px 0 0', padding: '8px 15px', fontWeight: activeAppId === opt.id ? 'bold' : 'normal' }}
                    >
                        {opt.name}
                    </button>
                ))}
            </div>
            
            {ActiveAppComponent ? <ActiveAppComponent /> : <div>Choose map option.</div>}
            
        </div>
    );
}

export default AppSwitcher;