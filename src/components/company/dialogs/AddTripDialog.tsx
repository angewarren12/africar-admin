import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Autocomplete,
  styled,
  alpha,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { API_BASE_URL } from '../../../config/api';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(
      theme.palette.primary.main,
      0.05
    )} 100%)`,
    backdropFilter: 'blur(10px)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
    theme.palette.primary.main,
    0.1
  )} 100%)`,
  padding: theme.spacing(2),
}));

interface Route {
  id: number;
  departure_station_id: number;
  arrival_station_id: number;
  departure_station_name: string;
  arrival_station_name: string;
  distance: number;
  duration: string;
  base_price: number;
}

interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  type: 'driver';
  status: 'active' | 'inactive' | 'on_leave';
  phone: string;
  license_number: string;
}

interface Vehicle {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  capacity: number;
  status: 'available' | 'in_use' | 'maintenance';
}

interface AddTripDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: number;
}

const AddTripDialog: React.FC<AddTripDialogProps> = ({
  open,
  onClose,
  onSuccess,
  companyId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [price, setPrice] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');

  useEffect(() => {
    if (open && companyId) {
      loadData();
    }
  }, [open, companyId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger les routes
      const routesResponse = await fetch(`${API_BASE_URL}/api/companies/${companyId}/routes`);
      if (!routesResponse.ok) throw new Error('Erreur lors du chargement des routes');
      const routesData = await routesResponse.json();
      setRoutes(routesData);

      // Charger les chauffeurs disponibles
      const driversResponse = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/personnel?type=driver&status=active`
      );
      if (!driversResponse.ok) throw new Error('Erreur lors du chargement des chauffeurs');
      const driversData = await driversResponse.json();
      setDrivers(driversData);

      // Charger les véhicules disponibles
      const vehiclesResponse = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/vehicles?status=available`
      );
      if (!vehiclesResponse.ok) throw new Error('Erreur lors du chargement des véhicules');
      const vehiclesData = await vehiclesResponse.json();
      console.log('Véhicules disponibles chargés:', vehiclesData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors du chargement des données', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRoute || !selectedDriver || !selectedVehicle || !departureTime || !arrivalTime || !price || !availableSeats) {
      enqueueSnackbar('Veuillez remplir tous les champs obligatoires', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route_id: selectedRoute.id,
          driver_id: selectedDriver.id,
          vehicle_id: selectedVehicle.id,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          price: Number(price),
          available_seats: Number(availableSeats),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du trajet');
      }

      enqueueSnackbar('Trajet créé avec succès', { variant: 'success' });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors de la création du trajet', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRoute(null);
    setSelectedDriver(null);
    setSelectedVehicle(null);
    setDepartureTime('');
    setArrivalTime('');
    setPrice('');
    setAvailableSeats('');
    onClose();
  };

  // Calculer l'heure d'arrivée lorsque l'heure de départ ou la route change
  useEffect(() => {
    if (departureTime && selectedRoute) {
      const departure = new Date(departureTime);
      const durationInMinutes = parseInt(selectedRoute.duration);
      const arrival = new Date(departure.getTime() + durationInMinutes * 60000); // convertir minutes en millisecondes
      
      // Formater la date en format ISO sans timezone
      const formattedArrival = arrival.toISOString().slice(0, 16);
      setArrivalTime(formattedArrival);
    }
  }, [departureTime, selectedRoute]);

  // Mettre à jour le prix automatiquement lorsqu'une route est sélectionnée
  useEffect(() => {
    if (selectedRoute) {
      setPrice(selectedRoute.base_price.toString());
    }
  }, [selectedRoute]);

  // Mettre à jour le nombre de places disponibles lorsqu'un véhicule est sélectionné
  useEffect(() => {
    if (selectedVehicle) {
      setAvailableSeats(selectedVehicle.capacity.toString());
    }
  }, [selectedVehicle]);

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Ajouter un nouveau trajet</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={routes}
                getOptionLabel={(option) => `${option.departure_station_name} → ${option.arrival_station_name}`}
                value={selectedRoute}
                onChange={(_, newValue) => setSelectedRoute(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Route" required />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <li key={key} {...otherProps}>
                      <Box>
                        <Typography variant="body1">
                          {option.departure_station_name} → {option.arrival_station_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Distance: {option.distance} km | Durée: {option.duration} | Prix de base: {option.base_price} FCFA
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Date et heure de départ"
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Date et heure d'arrivée"
                type="datetime-local"
                value={arrivalTime}
                disabled
                InputLabelProps={{ shrink: true }}
                helperText={selectedRoute ? `Durée estimée: ${selectedRoute.duration} minutes` : ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={drivers}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                value={selectedDriver}
                onChange={(_, newValue) => setSelectedDriver(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Chauffeur" required />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <li key={key} {...otherProps}>
                      <Box>
                        <Typography variant="body1">
                          {option.first_name} {option.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tél: {option.phone} | Permis: {option.license_number}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={vehicles}
                getOptionLabel={(option) => {
                  if (!option) return '';
                  return `${option.brand} ${option.model} (${option.registrationNumber})`;
                }}
                value={selectedVehicle}
                onChange={(_, newValue) => {
                  console.log('Nouveau véhicule sélectionné:', newValue);
                  setSelectedVehicle(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Véhicule" required />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <li key={key} {...otherProps}>
                      <Box>
                        <Typography variant="body1">
                          {option.brand} {option.model}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Immatriculation: {option.registrationNumber} | Type: {option.type} | Capacité: {option.capacity} places
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option.id === value.id;
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Prix"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                  endAdornment: <Typography>FCFA</Typography>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Places disponibles"
                type="number"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Création...' : 'Créer'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddTripDialog;
