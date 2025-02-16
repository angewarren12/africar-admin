import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  styled,
  alpha,
  Button,
  IconButton,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  DirectionsBus,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const VehicleCard = styled(Card)(({ theme }) => ({
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
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

interface Vehicle {
  id: number;
  company_id: number;
  registration_number: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  insurance_expiry: string;
  technical_visit_expiry: string;
  created_at: string;
  updated_at: string;
}

interface CompanyVehiclesProps {
  vehicles: Vehicle[];
  companyId: number;
}

const statusColors: Record<string, 'success' | 'error' | 'warning'> = {
  active: 'success',
  maintenance: 'warning',
  inactive: 'error',
};

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle fontSize="small" color="success" />,
  maintenance: <ScheduleIcon fontSize="small" color="warning" />,
  inactive: <ErrorIcon fontSize="small" color="error" />,
};

const statusLabels: Record<string, string> = {
  active: 'En service',
  maintenance: 'En maintenance',
  inactive: 'Hors service',
};

const CompanyVehicles: React.FC<CompanyVehiclesProps> = ({ vehicles, companyId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    registration_number: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 0,
    status: 'active',
    insurance_expiry: '',
    technical_visit_expiry: '',
  });

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      registration_number: vehicle.registration_number,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      capacity: vehicle.capacity,
      status: vehicle.status,
      insurance_expiry: vehicle.insurance_expiry.split('T')[0],
      technical_visit_expiry: vehicle.technical_visit_expiry.split('T')[0],
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    setFormData({
      registration_number: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      capacity: 0,
      status: 'active',
      insurance_expiry: '',
      technical_visit_expiry: '',
    });
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    // Implémenter la logique de sauvegarde
    setOpenDialog(false);
  };

  const handleDelete = (vehicleId: number) => {
    // Implémenter la logique de suppression
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Véhicules</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Ajouter un véhicule
        </Button>
      </Box>

      {vehicles.length === 0 ? (
        <StyledCard>
          <Box p={3} textAlign="center">
            <Typography color="text.secondary">
              Aucun véhicule n'a été ajouté pour cette compagnie.
            </Typography>
          </Box>
        </StyledCard>
      ) : (
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <VehicleCard>
                <Box p={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {vehicle.brand} {vehicle.model}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Immatriculation: {vehicle.registration_number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Année: {vehicle.year}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Capacité: {vehicle.capacity} places
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(vehicle)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(vehicle.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box mt={2} display="flex" flexDirection="column" gap={1}>
                    <Chip
                      icon={statusIcons[vehicle.status]}
                      label={statusLabels[vehicle.status]}
                      size="small"
                      color={statusColors[vehicle.status]}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Assurance valide jusqu'au {format(new Date(vehicle.insurance_expiry), 'dd MMMM yyyy', { locale: fr })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Visite technique valide jusqu'au {format(new Date(vehicle.technical_visit_expiry), 'dd MMMM yyyy', { locale: fr })}
                    </Typography>
                  </Box>
                </Box>
              </VehicleCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Numéro d'immatriculation"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marque"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Modèle"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Année"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Capacité"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Statut"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Expiration assurance"
                value={formData.insurance_expiry}
                onChange={(e) => setFormData({ ...formData, insurance_expiry: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Expiration visite technique"
                value={formData.technical_visit_expiry}
                onChange={(e) => setFormData({ ...formData, technical_visit_expiry: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.registration_number || !formData.brand || !formData.model}
          >
            {editingVehicle ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyVehicles;
