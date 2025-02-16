import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

interface Station {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  latitude: number;
  longitude: number;
  is_main_station: boolean;
  features: {
    hasWaitingRoom: boolean;
    hasTicketOffice: boolean;
    hasParking: boolean;
  };
  status: 'active' | 'inactive' | 'under_maintenance';
  created_at: string;
  updated_at: string;
  departures_count: number;
  arrivals_count: number;
  stops_count: number;
}

interface NewStation {
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  latitude: string;
  longitude: string;
  is_main_station: boolean;
  features: {
    hasWaitingRoom: boolean;
    hasTicketOffice: boolean;
    hasParking: boolean;
  };
}

const initialNewStation: NewStation = {
  name: '',
  city: '',
  address: '',
  phone: '',
  email: '',
  capacity: 0,
  latitude: '',
  longitude: '',
  is_main_station: false,
  features: {
    hasWaitingRoom: false,
    hasTicketOffice: false,
    hasParking: false
  }
};

const Stations: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStation, setNewStation] = useState<NewStation>(initialNewStation);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/companies/1/stations');
      setStations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des stations:', error);
      showNotification('Erreur lors de la récupération des stations', 'error');
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!newStation.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!newStation.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    
    if (newStation.capacity < 0) {
      newErrors.capacity = 'La capacité doit être positive';
    }
    
    if (newStation.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStation.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (newStation.latitude && !/^-?\d*\.?\d*$/.test(newStation.latitude)) {
      newErrors.latitude = 'Latitude invalide';
    }
    
    if (newStation.longitude && !/^-?\d*\.?\d*$/.test(newStation.longitude)) {
      newErrors.longitude = 'Longitude invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStation = async () => {
    if (!validateForm()) {
      showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/api/companies/1/stations', {
        ...newStation,
        capacity: Number(newStation.capacity),
        latitude: newStation.latitude ? Number(newStation.latitude) : null,
        longitude: newStation.longitude ? Number(newStation.longitude) : null
      });
      
      showNotification('Station créée avec succès', 'success');
      setOpenDialog(false);
      setNewStation(initialNewStation);
      fetchStations();
    } catch (error: any) {
      console.error('Erreur lors de la création de la station:', error);
      
      let errorMessage = 'Erreur lors de la création de la station';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      if (error.response?.data?.fields) {
        errorMessage += ': ' + error.response.data.fields.join(', ');
      }
      
      showNotification(errorMessage, 'error');
    }
  };

  const handleChange = (field: keyof NewStation) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewStation(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFeatureChange = (feature: keyof NewStation['features']) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewStation(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: event.target.checked
      }
    }));
  };

  const getStatusColor = (status: Station['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'under_maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Gares</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Ajouter une Gare
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Ville</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Capacité</TableCell>
              <TableCell>Équipements</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Statistiques</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map((station) => (
              <TableRow key={station.id}>
                <TableCell>{station.name}</TableCell>
                <TableCell>{station.city}</TableCell>
                <TableCell>{station.address}</TableCell>
                <TableCell>
                  <div>{station.phone}</div>
                  <div>{station.email}</div>
                </TableCell>
                <TableCell>{station.capacity} places</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {station.features.hasWaitingRoom && (
                      <Chip label="Salle d'attente" size="small" color="info" />
                    )}
                    {station.features.hasTicketOffice && (
                      <Chip label="Guichet" size="small" color="info" />
                    )}
                    {station.features.hasParking && (
                      <Chip label="Parking" size="small" color="info" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={station.status}
                    color={getStatusColor(station.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <div>Départs: {station.departures_count}</div>
                  <div>Arrivées: {station.arrivals_count}</div>
                  <div>Arrêts: {station.stops_count}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ajouter une nouvelle gare</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la gare"
                value={newStation.name}
                onChange={handleChange('name')}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ville"
                value={newStation.city}
                onChange={handleChange('city')}
                required
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                value={newStation.address}
                onChange={handleChange('address')}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={newStation.phone}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newStation.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capacité"
                type="number"
                value={newStation.capacity}
                onChange={handleChange('capacity')}
                error={!!errors.capacity}
                helperText={errors.capacity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude"
                value={newStation.latitude}
                onChange={handleChange('latitude')}
                error={!!errors.latitude}
                helperText={errors.latitude}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude"
                value={newStation.longitude}
                onChange={handleChange('longitude')}
                error={!!errors.longitude}
                helperText={errors.longitude}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newStation.is_main_station}
                    onChange={(e) => setNewStation(prev => ({
                      ...prev,
                      is_main_station: e.target.checked
                    }))}
                  />
                }
                label="Gare principale"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Équipements
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newStation.features.hasWaitingRoom}
                    onChange={handleFeatureChange('hasWaitingRoom')}
                  />
                }
                label="Salle d'attente"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newStation.features.hasTicketOffice}
                    onChange={handleFeatureChange('hasTicketOffice')}
                  />
                }
                label="Guichet"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newStation.features.hasParking}
                    onChange={handleFeatureChange('hasParking')}
                  />
                }
                label="Parking"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleAddStation} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Stations;
