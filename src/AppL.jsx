import React, { useState } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { createTestPhoto } from './api/photo';

const TEST_PHOTO_DATA = {
    name: "Testowy Zamek (Wawel)",
    lat: 50.054, 
    lon: 19.935,
    created: new Date().toISOString() // Format daty ISO dla FastAPI
};

function App() {
    const [photosState, setPhotosState] = useState({
        data: [],
        setPhotos: (newPhotos) => setPhotosState(prev => ({ ...prev, data: newPhotos })),
        loading: false,
    });
    
    const center = { lat: 50.061, lon: 19.937 }; // Kraków - centrum

    const handleAddPhoto = async () => {
        const result = await createTestPhoto(TEST_PHOTO_DATA);
        if (result && result.id) {
            alert(`Dodano nowe zdjęcie! ID: ${result.id}. Odśwież mapę.`);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Prototyp Geo-App (Leaflet)</h1>
            <p>Backend: FastAPI na http://127.0.0.1:8001 | Frontend: Vite/React na 5173</p>
            
            <button onClick={handleAddPhoto} style={{ marginBottom: '20px', padding: '10px' }}>
                + Dodaj testowe zdjęcie (POST)
            </button>

            {/* Komponent LeafletMap, do którego przekazujemy stan */}
            <LeafletMap photos={photosState} center={center} />
            
            {/* Wyświetlanie listy pobranych ID dla celów debugowania */}
            <hr />
            <h2>Pobrane zdjęcia (IDS):</h2>
            <p>{photosState.data.map(p => p.id).join(', ')}</p>
        </div>
    );
}

export default App;