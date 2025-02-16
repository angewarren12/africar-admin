import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DirectionsBus
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import { API_BASE_URL } from '../../config/api';
import AddTripDialog from './dialogs/AddTripDialog';
import EditTripDialog from './dialogs/EditTripDialog';
import DeleteConfirmDialog from '../common/DeleteConfirmDialog';
import TripStopsDialog from '../trips/TripStopsDialog';

interface Trip {
  id: number;
  company_id: number;
  route_id: number;
  vehicle_id: number;
  driver_id: number;
  departure_time: string;
  arrival_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
  // Relations
  route: {
    departure_station_name: string;
    arrival_station_name: string;
    distance: number;
    duration: string;
  };
  vehicle: {
    registration_number: string;
    model: string;
  };
  driver: {
    name: string;
    phone: string;
    license_number: string;
  };
}

interface TripListProps {
  companyId: number;
}

const TripList: React.FC<TripListProps> = ({ companyId }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isStopsDialogOpen, setIsStopsDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log('TripList monté, chargement des trajets...');
    loadTrips();
  }, [companyId, selectedStatus]);

  const loadTrips = async () => {
    try {
      console.log('=== DÉBUT CHARGEMENT DES TRAJETS ===');
      console.log('ID de la compagnie:', companyId);
      
      setLoading(true);
      const url = `${API_BASE_URL}/api/companies/${companyId}/trips${
        selectedStatus !== 'all' ? `?status=${selectedStatus}` : ''
      }`;
      console.log('Chargement des trajets:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des trajets');
      }
      
      const data = await response.json();
      console.log('=== DONNÉES REÇUES DU BACKEND ===');
      console.log('Nombre de trajets:', data.length);
      data.forEach((trip: Trip, index: number) => {
        console.log(`\nTrajet #${index + 1}:`);
        console.log('ID:', trip.id);
        console.log('Route:', trip.route.departure_station_name, '->', trip.route.arrival_station_name);
        console.log('Chauffeur:', {
          name: trip.driver.name,
          phone: trip.driver.phone,
          license: trip.driver.license_number
        });
        console.log('Véhicule:', trip.vehicle.registration_number, '(', trip.vehicle.model, ')');
        console.log('Horaires:', {
          depart: new Date(trip.departure_time).toLocaleString(),
          arrivee: new Date(trip.arrival_time).toLocaleString()
        });
        console.log('Statut:', trip.status);
        console.log('Prix:', trip.price, 'FCFA');
        console.log('Places disponibles:', trip.available_seats);
      });
      
      console.log('Données brutes reçues:', JSON.stringify(data, null, 2));
      
      setTrips(data);
      setFilteredTrips(data); // Initialiser les trajets filtrés avec tous les trajets
    } catch (error) {
      console.error('Erreur lors du chargement des trajets:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors du chargement des trajets', { 
        variant: 'error',
        autoHideDuration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...trips];

    // Filtre par statut
    if (selectedStatus !== 'all') {
      result = result.filter(trip => trip.status === selectedStatus);
    }

    // Filtre par date
    if (dateRange.start) {
      result = result.filter(trip => new Date(trip.departure_time) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      result = result.filter(trip => new Date(trip.departure_time) <= new Date(dateRange.end));
    }

    // Filtre par chauffeur
    if (selectedDriver !== 'all') {
      result = result.filter(trip => trip.driver.name === selectedDriver);
    }

    // Filtre par véhicule
    if (selectedVehicle !== 'all') {
      result = result.filter(trip => trip.vehicle.registration_number === selectedVehicle);
    }

    // Filtre par recherche (station de départ/arrivée)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trip => 
        trip.route.departure_station_name.toLowerCase().includes(query) ||
        trip.route.arrival_station_name.toLowerCase().includes(query)
      );
    }

    setFilteredTrips(result);
  }, [trips, selectedStatus, dateRange, searchQuery, selectedDriver, selectedVehicle]);

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setEditDialogOpen(true);
  };

  const handleDelete = (trip: Trip) => {
    setSelectedTrip(trip);
    setDeleteDialogOpen(true);
  };

  const handleManageStops = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsStopsDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setAddDialogOpen(false);
    loadTrips();
    enqueueSnackbar('Trajet ajouté avec succès', { 
      variant: 'success',
      autoHideDuration: 3000
    });
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedTrip(null);
    loadTrips();
    enqueueSnackbar('Trajet modifié avec succès', { 
      variant: 'success',
      autoHideDuration: 3000
    });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTrip) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/trips/${selectedTrip.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      setDeleteDialogOpen(false);
      setSelectedTrip(null);
      loadTrips();
      enqueueSnackbar('Trajet supprimé avec succès', { 
        variant: 'success',
        autoHideDuration: 3000
      });
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors de la suppression', { 
        variant: 'error',
        autoHideDuration: 3000
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Planifié';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const renderActions = (trip: Trip) => (
    <Box display="flex" gap={1}>
      <Tooltip title="Gérer les arrêts">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleManageStops(trip);
          }}
        >
          <DirectionsBus fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Modifier">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(trip);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Supprimer">
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(trip);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Liste des trajets
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Nouveau trajet
        </Button>

        {/* Filtres */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          {/* Filtre par statut */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={selectedStatus}
              label="Statut"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="all">Tous les statuts</MenuItem>
              <MenuItem value="scheduled">Planifié</MenuItem>
              <MenuItem value="in_progress">En cours</MenuItem>
              <MenuItem value="completed">Terminé</MenuItem>
              <MenuItem value="cancelled">Annulé</MenuItem>
            </Select>
          </FormControl>

          {/* Filtre par date */}
          <TextField
            type="date"
            label="Date de départ (de)"
            size="small"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="Date de départ (à)"
            size="small"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />

          {/* Filtre par chauffeur */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Chauffeur</InputLabel>
            <Select
              value={selectedDriver}
              label="Chauffeur"
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <MenuItem value="all">Tous les chauffeurs</MenuItem>
              {Array.from(new Set(trips.map(trip => trip.driver.name))).map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtre par véhicule */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Véhicule</InputLabel>
            <Select
              value={selectedVehicle}
              label="Véhicule"
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <MenuItem value="all">Tous les véhicules</MenuItem>
              {Array.from(new Set(trips.map(trip => trip.vehicle.registration_number))).map(reg => (
                <MenuItem key={reg} value={reg}>{reg}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Recherche par station */}
          <TextField
            label="Rechercher une station"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom de la station..."
            sx={{ minWidth: 200 }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
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
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>
                    {trip.route.departure_station_name} → {trip.route.arrival_station_name}
                  </TableCell>
                  <TableCell>
                    {trip.vehicle.registration_number} ({trip.vehicle.model})
                  </TableCell>
                  <TableCell>
                    {trip.driver.name}
                    <Typography variant="caption" display="block" color="text.secondary">
                      Tél: {trip.driver.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(new Date(trip.departure_time), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(trip.arrival_time), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>{trip.price} FCFA</TableCell>
                  <TableCell>{trip.available_seats}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(trip.status)}
                      color={getStatusColor(trip.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {renderActions(trip)}
                  </TableCell>
                </TableRow>
              ))}
              {filteredTrips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Aucun trajet trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialogs */}
      <AddTripDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
        companyId={companyId}
      />

      {selectedTrip && (
        <EditTripDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedTrip(null);
          }}
          onSuccess={handleEditSuccess}
          trip={selectedTrip}
          companyId={companyId}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedTrip(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le trajet"
        content="Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible."
      />

      {selectedTrip && (
        <TripStopsDialog
          open={isStopsDialogOpen}
          onClose={() => {
            setIsStopsDialogOpen(false);
            setSelectedTrip(null);
          }}
          tripId={selectedTrip.id}
          companyId={companyId}
        />
      )}
    </Box>
  );
};

export default TripList;
