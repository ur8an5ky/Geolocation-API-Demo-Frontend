import React, { useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchPhotosInArea } from '../api/photo';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const MapLibreMap = ({ photos, center }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleMoveEnd = useCallback(async (evt) => {
        const map = evt.target;
        const bounds = map.getBounds();

        const bbox = {
            min_lat: bounds.getSouth(),
            min_lon: bounds.getWest(),
            max_lat: bounds.getNorth(),
            max_lon: bounds.getEast(),
        };

        const data = await fetchPhotosInArea(bbox);
        photos.setPhotos(data);
    }, [photos]);

    return (
        <Map
            mapLib={maplibregl}
            initialViewState={{
                longitude: center.lon,
                latitude: center.lat,
                zoom: 13
            }}
            style={{ height: '80vh', width: '100%' }}
            mapStyle={MAP_STYLE}
            onMoveEnd={handleMoveEnd}
        >
            <NavigationControl position="top-right" />

            {photos.data.map(photo => (
                <Marker
                    key={photo.id}
                    longitude={photo.lon}
                    latitude={photo.lat}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setSelectedPhoto(photo);
                    }}
                >
                    <div style={{ cursor: 'pointer', fontSize: '24px' }}>
                        📍
                    </div>
                </Marker>
            ))}

            {selectedPhoto && (
                <Popup
                    longitude={selectedPhoto.lon}
                    latitude={selectedPhoto.lat}
                    anchor="top"
                    onClose={() => setSelectedPhoto(null)}
                    closeOnClick={false}
                >
                    <div style={{ color: 'black', padding: '5px' }}>
                        <h3 style={{ margin: '0 0 5px 0' }}>{selectedPhoto.name}</h3>
                        <p style={{ margin: 0 }}>ID: {selectedPhoto.id}</p>
                        <p style={{ margin: 0, fontSize: '0.8em' }}>Plik: {selectedPhoto.filename}</p>
                    </div>
                </Popup>
            )}
        </Map>
    );
};

export default MapLibreMap;