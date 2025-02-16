import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  styled,
  alpha,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsBus,
  AccessTime,
  People,
  LocalAtm,
  Info as InfoIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { API_BASE_URL } from '../../config/api';
import AddTripStopDialog from './dialogs/AddTripStopDialog';
import EditTripStopDialog from './dialogs/EditTripStopDialog';
import DeleteConfirmDialog from '../common/DeleteConfirmDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  '&.MuiTableCell-head': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  '&.MuiChip-colorSuccess': {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.dark,
  },
  '&.MuiChip-colorWarning': {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.dark,
  },
  '&.MuiChip-colorError': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.dark,
  },
}));

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

interface TripStop {
  id: number;
  station_id: number;
  station_name: string;
  station_city: string;
  arrival_time: string;
  departure_time: string;
  stop_order: number;
  price: number;
  available_seats: number;
  boarding_count: number;
  alighting_count: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  platform: string;
  notes: string;
}

interface TripStopStats {
  total_stops: number;
  total_boardings: number;
  total_alightings: number;
  min_available_seats: number;
  completed_stops: number;
  cancelled_stops: number;
  avg_occupancy_rate: number;
}

interface TripStopsDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: number;
  companyId: number;
}

const TripStopsDialog: React.FC<TripStopsDialogProps> = ({
  open,
  onClose,
  tripId,
  companyId,
}) => {
  const [stops, setStops] = useState<TripStop[]>([]);
  const [stats, setStats] = useState<TripStopStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStops = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/trips/${tripId}/stops`
      );
      if (!response.ok) throw new Error('Erreur lors de la récupération des arrêts');
      const data = await response.json();
      setStops(data);
    } catch (err) {
      setError('Impossible de charger les arrêts');
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/trips/${tripId}/stops/stats`
      );
      if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchStops(), fetchStats()]);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, tripId, companyId]);

  const handleAddStop = async (newStop: Omit<TripStop, 'id'>) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/trips/${tripId}/stops`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStop),
        }
      );
      if (!response.ok) throw new Error('Erreur lors de l\'ajout de l\'arrêt');
      await loadData();
      setIsAddDialogOpen(false);
    } catch (err) {
      setError('Impossible d\'ajouter l\'arrêt');
      console.error(err);
    }
  };

  const handleEditStop = async (stopId: number, updatedStop: Partial<TripStop>) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/trips/${tripId}/stops/${stopId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedStop),
        }
      );
      if (!response.ok) throw new Error('Erreur lors de la modification de l\'arrêt');
      await loadData();
      setIsEditDialogOpen(false);
      setSelectedStop(null);
    } catch (err) {
      setError('Impossible de modifier l\'arrêt');
      console.error(err);
    }
  };

  const handleDeleteStop = async () => {
    if (!selectedStop) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/trips/${tripId}/stops/${selectedStop.id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Erreur lors de la suppression de l\'arrêt');
      await loadData();
      setIsDeleteDialogOpen(false);
      setSelectedStop(null);
    } catch (err) {
      setError('Impossible de supprimer l\'arrêt');
      console.error(err);
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'scheduled':
        return 'Prévu';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="600">Gestion des arrêts</Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddDialogOpen(true)}
              sx={{ mr: 2 }}
            >
              Ajouter un arrêt
            </Button>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {/* Statistiques */}
            {stats && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Statistiques du trajet
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
                  <StatBox>
                    <DirectionsBus sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                    <Typography variant="h4" color="primary.main" fontWeight="600">
                      {stats.total_stops}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Arrêts totaux
                    </Typography>
                  </StatBox>
                  <StatBox>
                    <People sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                    <Typography variant="h4" color="primary.main" fontWeight="600">
                      {stats.total_boardings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Montées totales
                    </Typography>
                  </StatBox>
                  <StatBox>
                    <AccessTime sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                    <Typography variant="h4" color="primary.main" fontWeight="600">
                      {stats.avg_occupancy_rate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Taux d'occupation moyen
                    </Typography>
                  </StatBox>
                  <StatBox>
                    <LocalAtm sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                    <Typography variant="h4" color="primary.main" fontWeight="600">
                      {stats.completed_stops}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Arrêts complétés
                    </Typography>
                  </StatBox>
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Liste des arrêts */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Ordre</StyledTableCell>
                    <StyledTableCell>Station</StyledTableCell>
                    <StyledTableCell>Horaires</StyledTableCell>
                    <StyledTableCell>Places</StyledTableCell>
                    <StyledTableCell>Prix</StyledTableCell>
                    <StyledTableCell>Quai</StyledTableCell>
                    <StyledTableCell>Statut</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stops.map((stop) => (
                    <TableRow key={stop.id} hover>
                      <TableCell>{stop.stop_order}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {stop.station_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stop.station_city}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(stop.arrival_time), 'HH:mm', { locale: fr })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(stop.departure_time), 'HH:mm', { locale: fr })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {stop.available_seats} places
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          +{stop.boarding_count} / -{stop.alighting_count}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {stop.price ? `${stop.price.toFixed(2)} €` : '-'}
                      </TableCell>
                      <TableCell>
                        {stop.platform || '-'}
                      </TableCell>
                      <TableCell>
                        <StyledChip
                          label={getStatusLabel(stop.status)}
                          color={getStatusColor(stop.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                          {stop.notes && (
                            <Tooltip title={stop.notes}>
                              <IconButton size="small">
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedStop(stop);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedStop(stop);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      {/* Dialogs */}
      <AddTripStopDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddStop}
        companyId={companyId}
      />

      {selectedStop && (
        <EditTripStopDialog
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedStop(null);
          }}
          onEdit={(updatedStop) => handleEditStop(selectedStop.id, updatedStop)}
          stop={selectedStop}
          companyId={companyId}
        />
      )}

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedStop(null);
        }}
        onConfirm={handleDeleteStop}
        title="Supprimer l'arrêt"
        content={`Êtes-vous sûr de vouloir supprimer l'arrêt à ${selectedStop?.station_name} ?`}
      />
    </Dialog>
  );
};

export default TripStopsDialog;
