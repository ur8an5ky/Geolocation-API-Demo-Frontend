import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchPhotosInArea } from '../api/photo';

// Naprawia ikonę Markera, ponieważ bundlery Reacta mają z tym problem
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
    iconUrl: 'leaflet/images/marker-icon.png',
    shadowUrl: 'leaflet/images/marker-shadow.png',
});
// Koniec naprawy

const MapEventController = ({ setPhotos }) => {
    const map = useMap();

    const loadPhotosInView = useCallback(async () => {
        const bounds = map.getBounds();
        
        const bbox = {
            min_lat: bounds.getSouthWest().lat,
            min_lon: bounds.getSouthWest().lng,
            max_lat: bounds.getNorthEast().lat,
            max_lon: bounds.getNorthEast().lng,
        };
        
        const data = await fetchPhotosInArea(bbox);
        
        setPhotos(data);
    }, [map, setPhotos]);

    useEffect(() => {
        loadPhotosInView();
        map.on('moveend', loadPhotosInView);
        
        return () => {
            map.off('moveend', loadPhotosInView);
        };
    }, [map, loadPhotosInView]);

    return null;
};

const LeafletMap = ({ photos, center }) => {
    const initialPosition = [center.lat, center.lon];

    return (
        <MapContainer 
            center={initialPosition} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: '80vh', width: '100%' }}
        >
            {/* Warstwa kafelków OpenStreetMap */}
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Komponent kontrolujący logikę API */}
            <MapEventController setPhotos={photos.setPhotos} />

            {/* Renderowanie Markerów */}
            {photos.data.map(photo => (
                <Marker key={photo.id} position={[photo.lat, photo.lon]}>
                    <Popup>
                        <h3>{photo.name} (ID: {photo.id})</h3>
                        <p>Plik: {photo.filename}</p>
                        <p>Dodano: {new Date(photo.created).toLocaleDateString()}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default LeafletMap;