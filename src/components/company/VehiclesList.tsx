import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  styled,
  alpha,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  DirectionsBus,
  Speed,
  LocalGasStation,
  AcUnit,
  Wifi,
  Usb,
  Wc,
} from '@mui/icons-material';
import AddVehicleDialog from './dialogs/AddVehicleDialog';
import VehicleDetailsDialog from './dialogs/VehicleDetailsDialog';
import EditVehicleDialog from './dialogs/EditVehicleDialog';
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
    theme.palette.background.paper,
    0.95
  )} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
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
  features: {
    hasAC: boolean;
    hasWifi: boolean;
    hasToilet: boolean;
    hasTv: boolean;
  };
  status: 'active' | 'inactive' | 'under_maintenance';
  statistics?: {
    completedTrips: number;
    activeTrips: number;
  };
  created_at: string;
  updated_at: string;
}

const VehiclesList: React.FC = () => {
  const { companyId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    loadVehicles();
  }, [companyId]);

  const loadVehicles = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}/vehicles`);
      if (!response.ok) throw new Error('Erreur lors du chargement des véhicules');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar('Erreur lors du chargement des véhicules', { variant: 'error' });
    }
  };

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleOpenDetailsDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
  };

  const handleOpenEditDialog = () => {
    setIsDetailsDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleOpenDeleteConfirm = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleAddVehicle = async (vehicleData: any) => {
    try {
      const response = await fetch(`/api/companies/${companyId}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) throw new Error('Erreur lors de la création du véhicule');

      await loadVehicles();
      handleCloseAddDialog();
      enqueueSnackbar('Véhicule ajouté avec succès', { variant: 'success' });
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar('Erreur lors de la création du véhicule', { variant: 'error' });
    }
  };

  const handleEditVehicle = async (updatedVehicle: Partial<Vehicle>) => {
    if (!selectedVehicle) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/companies/${companyId}/vehicles/${selectedVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVehicle),
      });

      if (!response.ok) throw new Error('Erreur lors de la modification du véhicule');

      await loadVehicles();
      handleCloseEditDialog();
      enqueueSnackbar('Véhicule modifié avec succès', { variant: 'success' });
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar('Erreur lors de la modification du véhicule', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/companies/${companyId}/vehicles/${selectedVehicle.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression du véhicule');

      await loadVehicles();
      handleCloseDeleteConfirm();
      enqueueSnackbar('Véhicule supprimé avec succès', { variant: 'success' });
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar('Erreur lors de la suppression du véhicule', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <Box>
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Liste des véhicules</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          }}
        >
          Ajouter un véhicule
        </Button>
      </Box>

      {/* Filtres */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Rechercher un véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Liste des véhicules */}
      <Grid container spacing={3}>
        {filteredVehicles.map((vehicle) => (
          <Grid item xs={12} md={6} key={vehicle.id}>
            <StyledCard
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: (theme) => `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
              onClick={() => handleOpenDetailsDialog(vehicle)}
            >
              <Box sx={{ p: 3 }}>
                {/* En-tête de la carte */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" gap={2}>
                    <DirectionsBus color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {vehicle.brand} {vehicle.model}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.registrationNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={vehicle.status === 'active' ? 'Actif' : 'Inactif'}
                    color={vehicle.status === 'active' ? 'success' : 'error'}
                    size="small"
                    sx={{ borderRadius: '16px' }}
                  />
                </Box>

                {/* Informations du véhicule */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Speed fontSize="small" color="action" />
                      <Typography variant="body2">
                        {vehicle.manufactureYear} km
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <LocalGasStation fontSize="small" color="action" />
                      <Typography variant="body2">Diesel</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Capacité
                      </Typography>
                      <Typography variant="body1">{vehicle.capacity} passagers</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Équipements */}
                <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                  {vehicle.features.hasAC && (
                    <Chip icon={<AcUnit />} label="Clim" size="small" variant="outlined" />
                  )}
                  {vehicle.features.hasWifi && (
                    <Chip icon={<Wifi />} label="Wi-Fi" size="small" variant="outlined" />
                  )}
                  {vehicle.features.hasToilet && (
                    <Chip icon={<Wc />} label="WC" size="small" variant="outlined" />
                  )}
                </Box>

                {/* Statistiques */}
                {vehicle.statistics && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Statistiques
                    </Typography>
                    <Typography variant="body1">
                      Voyages effectués : {vehicle.statistics.completedTrips}
                    </Typography>
                    <Typography variant="body1">
                      Voyages en cours : {vehicle.statistics.activeTrips}
                    </Typography>
                  </Box>
                )}
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Dialogues */}
      <AddVehicleDialog
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddVehicle}
      />

      {selectedVehicle && (
        <>
          <VehicleDetailsDialog
            open={isDetailsDialogOpen}
            onClose={handleCloseDetailsDialog}
            vehicle={selectedVehicle}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteConfirm}
          />

          <EditVehicleDialog
            open={isEditDialogOpen}
            onClose={handleCloseEditDialog}
            vehicle={selectedVehicle}
            onEdit={handleEditVehicle}
          />

          <DeleteConfirmDialog
            open={isDeleteConfirmOpen}
            onClose={handleCloseDeleteConfirm}
            onConfirm={handleDeleteVehicle}
            title="Supprimer le véhicule"
            content={`Êtes-vous sûr de vouloir supprimer le véhicule ${selectedVehicle.registrationNumber} ? Cette action est irréversible.`}
          />
        </>
      )}
    </Box>
  );
};

export default VehiclesList;
