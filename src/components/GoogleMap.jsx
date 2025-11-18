import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { fetchPhotosInRegion } from '../api/photo';

const libraries = ['places']; 

const mapContainerStyle = {
  height: '80vh',
  width: '100%',
};

const initialCenter = { lat: 50.061, lng: 19.937 };
const initialZoom = 13;

const GoogleMapComponent = ({ photos, center }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    id: 'google-map-script',
    libraries,
  });

  const [mapInstance, setMapInstance] = useState(null);

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
    
    const data = await fetchPhotosInRegion(bbox);
    photos.setPhotos(data);
  }, [mapInstance, photos]);

  if (loadError) return <div>Błąd ładowania map Google. Sprawdź klucz API!</div>;
  if (!isLoaded) return <div>Ładowanie mapy...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={initialCenter}
      zoom={initialZoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onDragEnd={handleBoundsChanged}
      onZoomChanged={handleBoundsChanged}
    >
      {/* Renderowanie Markerów */}
      {photos.data.map(photo => (
        <Marker
          key={photo.id}
          position={{ lat: photo.lat, lng: photo.lon }}
          title={photo.name}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;