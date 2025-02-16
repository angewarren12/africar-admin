import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icônes personnalisées
const startIcon = {
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
};

const endIcon = {
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
};

// Données simulées des trajets actifs
const activeTrips = [
  {
    id: 1,
    driver: "Konan Kouamé",
    origin: { lat: 7.539989, lng: -5.547080 }, // Abidjan
    destination: { lat: 6.827623, lng: -5.289343 }, // Yamoussoukro
    status: "En cours",
    startTime: "14:30"
  },
  {
    id: 2,
    driver: "Traoré Ibrahim",
    origin: { lat: 7.692871, lng: -5.044922 }, // Bouaké
    destination: { lat: 9.453886, lng: -5.629883 }, // Korhogo
    status: "En cours",
    startTime: "15:15"
  }
];

const center = { lat: 7.539989, lng: -5.547080 }; // Centre sur Abidjan

export const ActiveTripsMap = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const MapComponent = () => {
    if (typeof window === 'undefined') return null;

    const startMarkerIcon = new Icon(startIcon);
    const endMarkerIcon = new Icon(endIcon);

    return (
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activeTrips.map((trip) => {
          const positions: LatLngExpression[] = [
            [trip.origin.lat, trip.origin.lng],
            [trip.destination.lat, trip.destination.lng]
          ];

          return (
            <React.Fragment key={trip.id}>
              <Polyline
                positions={positions}
                color="#2065D1"
                weight={3}
                opacity={0.6}
                dashArray="10, 10"
              />
              <Marker 
                position={[trip.origin.lat, trip.origin.lng]}
                icon={startMarkerIcon}
              >
                <Popup>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Chauffeur:</strong> {trip.driver}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Départ:</strong> {trip.startTime}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {trip.status}
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
              <Marker 
                position={[trip.destination.lat, trip.destination.lng]}
                icon={endMarkerIcon}
              >
                <Popup>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Chauffeur:</strong> {trip.driver}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Destination</strong>
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    );
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Trajets Actifs
        </Typography>
        <Chip 
          label={`${activeTrips.length} trajet${activeTrips.length > 1 ? 's' : ''} en cours`}
          color="primary"
        />
      </Box>
      <Box 
        sx={{ 
          height: 400, 
          width: '100%', 
          position: 'relative',
          '& .leaflet-container': {
            height: '100%',
            width: '100%',
            borderRadius: '12px',
          }
        }}
      >
        {isMounted && <MapComponent />}
      </Box>
    </Paper>
  );
};
