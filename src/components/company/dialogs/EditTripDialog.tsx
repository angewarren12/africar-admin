import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  styled,
  alpha,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
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
}

interface Vehicle {
  id: number;
  registration_number: string;
  model: string;
  status: 'available' | 'in_use' | 'maintenance';
  capacity: number;
}

interface Trip {
  id: number;
  route_id: number;
  driver_id: number;
  vehicle_id: number;
  departure_time: string;
  arrival_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  available_seats: number;
  route: {
    departure_station_name: string;
    arrival_station_name: string;
    distance: number;
    duration: string;
  };
  driver: {
    first_name: string;
    last_name: string;
  };
  vehicle: {
    registration_number: string;
    model: string;
    capacity: number;
  };
}

interface EditTripDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: number;
  trip: Trip;
}

const EditTripDialog: React.FC<EditTripDialogProps> = ({
  open,
  onClose,
  onSuccess,
  companyId,
  trip,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [departureTime, setDepartureTime] = useState(trip.departure_time);
  const [arrivalTime, setArrivalTime] = useState(trip.arrival_time);
  const [price, setPrice] = useState(trip.price.toString());
  const [availableSeats, setAvailableSeats] = useState(trip.available_seats.toString());
  const [status, setStatus] = useState(trip.status);

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
        `${API_BASE_URL}/api/companies/${companyId}/personnel?type=driver`
      );
      if (!driversResponse.ok) throw new Error('Erreur lors du chargement des chauffeurs');
      const driversData = await driversResponse.json();
      setDrivers(driversData);

      // Charger les véhicules
      const vehiclesResponse = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/vehicles`
      );
      if (!vehiclesResponse.ok) throw new Error('Erreur lors du chargement des véhicules');
      const vehiclesData = await vehiclesResponse.json();
      setVehicles(vehiclesData);

      // Initialiser les sélections avec les données actuelles du trajet
      const currentRoute = routesData.find((r: Route) => r.id === trip.route_id);
      const currentDriver = driversData.find((d: Driver) => d.id === trip.driver_id);
      const currentVehicle = vehiclesData.find((v: Vehicle) => v.id === trip.vehicle_id);

      setSelectedRoute(currentRoute || null);
      setSelectedDriver(currentDriver || null);
      setSelectedVehicle(currentVehicle || null);
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

      const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/trips/${trip.id}`, {
        method: 'PUT',
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
          status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la modification du trajet');
      }

      enqueueSnackbar('Trajet modifié avec succès', { variant: 'success' });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors de la modification du trajet', {
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
    setDepartureTime(trip.departure_time);
    setArrivalTime(trip.arrival_time);
    setPrice(trip.price.toString());
    setAvailableSeats(trip.available_seats.toString());
    setStatus(trip.status);
    onClose();
  };

  // Mettre à jour le prix automatiquement lorsqu'une route est sélectionnée
  useEffect(() => {
    if (selectedRoute && selectedRoute.id !== trip.route_id) {
      setPrice(selectedRoute.base_price.toString());
    }
  }, [selectedRoute]);

  // Mettre à jour le nombre de places disponibles lorsqu'un véhicule est sélectionné
  useEffect(() => {
    if (selectedVehicle && selectedVehicle.id !== trip.vehicle_id) {
      setAvailableSeats(selectedVehicle.capacity.toString());
    }
  }, [selectedVehicle]);

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Modifier le trajet #{trip.id}</Typography>
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
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Trip['status'])}
                  label="Statut"
                >
                  <MenuItem value="scheduled">Programmé</MenuItem>
                  <MenuItem value="in_progress">En cours</MenuItem>
                  <MenuItem value="completed">Terminé</MenuItem>
                  <MenuItem value="cancelled">Annulé</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={routes}
                getOptionLabel={(option) => `${option.departure_station_name} → ${option.arrival_station_name}`}
                value={selectedRoute}
                onChange={(_, newValue) => setSelectedRoute(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Route" required />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">
                        {option.departure_station_name} → {option.arrival_station_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Distance: {option.distance} km | Durée: {option.duration} | Prix de base: {option.base_price} FCFA
                      </Typography>
                    </Box>
                  </li>
                )}
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
                onChange={(e) => setArrivalTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: departureTime }}
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
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={vehicles}
                getOptionLabel={(option) => `${option.registration_number} (${option.model})`}
                value={selectedVehicle}
                onChange={(_, newValue) => setSelectedVehicle(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Véhicule" required />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">
                        {option.registration_number} ({option.model})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Capacité: {option.capacity} places
                      </Typography>
                    </Box>
                  </li>
                )}
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
          {loading ? 'Modification...' : 'Modifier'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditTripDialog;
