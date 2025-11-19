import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { fetchPhotosInArea } from '../api/photo';

const libraries = ['places']; 

const initialCenter = { lat: 50.061, lng: 19.937 };

const GoogleMapComponent = ({ photos, center }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
        id: 'google-map-script',
        libraries,
    });

    const [mapInstance, setMapInstance] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const onLoad = useCallback(map => {
        setMapInstance(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMapInstance(null);
    }, []);
  
    const handleBoundsChanged = useCallback(async () => {
        if (!mapInstance) return;

        const bounds = mapInstance.getBounds();
        if (!bounds) return;
    
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const bbox = {
            min_lat: sw.lat(),
            min_lon: sw.lng(),
            max_lat: ne.lat(),
            max_lon: ne.lng(),
        };
    
        const data = await fetchPhotosInArea(bbox);
        photos.setPhotos(data);
    }, [mapInstance, photos]);

    if (loadError) return <div>Error loading Google Maps. Please check your API key!</div>;
    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <GoogleMap
            center={initialCenter}
            mapContainerStyle={{ height: '80vh', width: '100%' }}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onDragEnd={handleBoundsChanged}
            onZoomChanged={handleBoundsChanged}
        >
            {photos.data.map(photo => (
                <Marker
                    key={photo.id}
                    position={{ lat: photo.lat, lng: photo.lon }}
                    title={photo.name}
                    onClick={() => setSelectedPhoto(photo)}
                />
            ))}

            {selectedPhoto && (
                <InfoWindow
                    position={{ lat: selectedPhoto.lat, lng: selectedPhoto.lon }}
                    onCloseClick={() => {
                        setSelectedPhoto(null);
                    }}
                >
                    <div style={{ color: 'black', padding: '5px' }}>
                        <h3 style={{ margin: '0 0 5px 0' }}>{selectedPhoto.name}</h3>
                        <p style={{ margin: 0 }}>ID: {selectedPhoto.id}</p>
                        <p style={{ margin: 0, fontSize: '0.8em' }}>Plik: {selectedPhoto.filename}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};
export default GoogleMapComponent;