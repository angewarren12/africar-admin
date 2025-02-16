import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Chip,
  Grid,
  styled,
  alpha,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  LinearProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import {
  Search,
  FilterList,
  DirectionsBus,
  AccessTime,
  LocationOn,
  Person,
  ArrowForward,
  MoreVert,
  Circle as CircleIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Speed,
  Timeline,
  TrendingUp,
  Warning,
  Delete,
} from '@mui/icons-material';
import AddTripDialog from './dialogs/AddTripDialog';
import TripDetailsDialog from './dialogs/TripDetailsDialog';
import EditTripDialog from './dialogs/EditTripDialog';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
    theme.palette.background.paper,
    0.95
  )} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
    theme.palette.primary.main,
    0.05
  )} 100%)`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 20px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  minWidth: 120,
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.1),
  },
}));

interface Trip {
  id: number;
  route: {
    departure_station_name: string;
    arrival_station_name: string;
    distance: number;
    duration: string;
  };
  vehicle: {
    registration_number: string;
    brand: string;
    model: string;
  };
  driver: {
    name: string;
    phone: string;
    license_number: string;
  };
  departure_time: string;
  arrival_time: string;
  status: string;
  price: number;
  available_seats: number;
}

const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/companies/1/trips`);
      if (!response.ok) throw new Error('Erreur lors du chargement des trajets');
      const data = await response.json();
      console.log('Données reçues du backend:', data);
      setTrips(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <Box>
      {loading && <LinearProgress />}
      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label="Statut"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Tous</MenuItem>
          <MenuItem value="scheduled">Planifié</MenuItem>
          <MenuItem value="in_progress">En cours</MenuItem>
          <MenuItem value="completed">Terminé</MenuItem>
          <MenuItem value="cancelled">Annulé</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Route</TableCell>
              <TableCell>Véhicule</TableCell>
              <TableCell>Chauffeur</TableCell>
              <TableCell>Départ</TableCell>
              <TableCell>Arrivée</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Places disponibles</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips
              .filter((trip) => statusFilter === 'all' || trip.status === statusFilter)
              .map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>
                    {trip.route.departure_station_name} → {trip.route.arrival_station_name}
                  </TableCell>
                  <TableCell>
                    {trip.vehicle.registration_number}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {trip.vehicle.brand} {trip.vehicle.model}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {trip.driver.name}
                    <Typography variant="caption" display="block" color="text.secondary">
                      Tél: {trip.driver.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(trip.departure_time).toLocaleString()}</TableCell>
                  <TableCell>{new Date(trip.arrival_time).toLocaleString()}</TableCell>
                  <TableCell>{trip.price} FCFA</TableCell>
                  <TableCell>{trip.available_seats}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        trip.status === 'scheduled'
                          ? 'Planifié'
                          : trip.status === 'in_progress'
                          ? 'En cours'
                          : trip.status === 'completed'
                          ? 'Terminé'
                          : 'Annulé'
                      }
                      color={
                        trip.status === 'scheduled'
                          ? 'primary'
                          : trip.status === 'in_progress'
                          ? 'warning'
                          : trip.status === 'completed'
                          ? 'success'
                          : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TripsList;
