import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  styled,
  alpha,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  DirectionsBus,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AcUnit,
  Tv,
  Wifi,
  Wc,
  UsbOutlined,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
    theme.palette.background.paper,
    0.95
  )} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

interface Vehicle {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  capacity: number;
  manufactureYear: number;
  status: 'active' | 'maintenance' | 'inactive';
  features: {
    hasAC: boolean;
    hasTV: boolean;
    hasWifi: boolean;
    hasToilet: boolean;
    hasUSBPorts: boolean;
  };
  statistics: {
    completedTrips: number;
    activeTrips: number;
  };
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

interface VehicleListProps {
  companyId: number;
}

const VehicleList: React.FC<VehicleListProps> = ({ companyId }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '',
    brand: '',
    model: '',
    type: '',
    capacity: '',
    manufactureYear: new Date().getFullYear().toString(),
    hasAC: false,
    hasTV: false,
    hasWifi: false,
    hasToilet: false,
    hasUSBPorts: false,
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/companies/${companyId}/vehicles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchVehicles();
    }
  }, [companyId]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationNumber: newVehicle.registrationNumber,
          brand: newVehicle.brand,
          model: newVehicle.model,
          type: newVehicle.type,
          capacity: newVehicle.capacity ? parseInt(newVehicle.capacity) : 0,
          manufactureYear: newVehicle.manufactureYear ? parseInt(newVehicle.manufactureYear) : new Date().getFullYear(),
          hasAC: newVehicle.hasAC,
          hasTV: newVehicle.hasTV,
          hasWifi: newVehicle.hasWifi,
          hasToilet: newVehicle.hasToilet,
          hasUSBPorts: newVehicle.hasUSBPorts,
          status: 'active'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchVehicles();
      setOpenDialog(false);
      setNewVehicle({
        registrationNumber: '',
        brand: '',
        model: '',
        type: '',
        capacity: '',
        manufactureYear: new Date().getFullYear().toString(),
        hasAC: false,
        hasTV: false,
        hasWifi: false,
        hasToilet: false,
        hasUSBPorts: false,
      });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" gutterBottom>
          Véhicules ({vehicles.length})
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Ajouter un véhicule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Immatriculation</TableCell>
              <TableCell>Marque</TableCell>
              <TableCell>Modèle</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Capacité</TableCell>
              <TableCell>Équipements</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Statistiques</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.registrationNumber}</TableCell>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.capacity} places</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {vehicle.features.hasAC && <AcUnit color="primary" titleAccess="Climatisation" />}
                    {vehicle.features.hasTV && <Tv color="primary" titleAccess="TV" />}
                    {vehicle.features.hasWifi && <Wifi color="primary" titleAccess="WiFi" />}
                    {vehicle.features.hasToilet && <Wc color="primary" titleAccess="Toilettes" />}
                    {vehicle.features.hasUSBPorts && <UsbOutlined color="primary" titleAccess="Ports USB" />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={vehicle.status === 'active' ? 'Actif' : vehicle.status === 'maintenance' ? 'Programmé' : 'Inactif'}
                    color={vehicle.status === 'active' ? 'success' : vehicle.status === 'maintenance' ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {vehicle.statistics.completedTrips} trajets terminés
                  </Typography>
                  <Typography variant="body2">
                    {vehicle.statistics.activeTrips} trajets en cours
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un véhicule</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Immatriculation"
              value={newVehicle.registrationNumber}
              onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
              required
            />
            <TextField
              label="Marque"
              value={newVehicle.brand}
              onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
              required
            />
            <TextField
              label="Modèle"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              required
            />
            <TextField
              label="Type"
              value={newVehicle.type}
              onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
            />
            <TextField
              label="Capacité"
              type="number"
              value={newVehicle.capacity}
              onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Année de fabrication"
              type="number"
              value={newVehicle.manufactureYear}
              onChange={(e) => setNewVehicle({ ...newVehicle, manufactureYear: e.target.value })}
              inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
            />
            <Typography variant="subtitle1" gutterBottom>
              Équipements
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newVehicle.hasAC}
                    onChange={(e) => setNewVehicle({ ...newVehicle, hasAC: e.target.checked })}
                  />
                }
                label="Climatisation"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newVehicle.hasTV}
                    onChange={(e) => setNewVehicle({ ...newVehicle, hasTV: e.target.checked })}
                  />
                }
                label="TV"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newVehicle.hasWifi}
                    onChange={(e) => setNewVehicle({ ...newVehicle, hasWifi: e.target.checked })}
                  />
                }
                label="WiFi"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newVehicle.hasToilet}
                    onChange={(e) => setNewVehicle({ ...newVehicle, hasToilet: e.target.checked })}
                  />
                }
                label="Toilettes"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newVehicle.hasUSBPorts}
                    onChange={(e) => setNewVehicle({ ...newVehicle, hasUSBPorts: e.target.checked })}
                  />
                }
                label="Ports USB"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleList;
