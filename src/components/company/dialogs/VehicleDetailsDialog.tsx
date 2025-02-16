import React from 'react';
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
  Button,
  Chip,
  LinearProgress,
  DeleteIcon,
  EditIcon,
} from '@mui/material';
import {
  Close as CloseIcon,
  DirectionsBus,
  Speed,
  LocalGasStation,
  AcUnit,
  Wifi,
  Usb,
  Wc,
  Build,
  Security,
} from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(
      theme.palette.background.paper,
      0.98
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

const VehicleIcon = styled(DirectionsBus)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.primary.main,
}));

const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.primary.main, 0.05),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
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

interface VehicleDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: (vehicle: Vehicle) => void;
}

const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({
  open,
  onClose,
  vehicle,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'info';
      case 'under_maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Disponible';
      case 'inactive':
        return 'Inactif';
      case 'under_maintenance':
        return 'En maintenance';
      default:
        return status;
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Détails du véhicule</Typography>
          <Box display="flex" gap={1}>
            <IconButton onClick={onEdit} size="small" color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* En-tête */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          mb={4}
          sx={{
            p: 3,
            borderRadius: 2,
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
                theme.palette.primary.main,
                0.05
              )} 100%)`,
          }}
        >
          <VehicleIcon />
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              {vehicle.brand} {vehicle.model}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {vehicle.registrationNumber}
            </Typography>
            <Chip
              label={getStatusLabel(vehicle.status)}
              color={getStatusColor(vehicle.status)}
              sx={{ borderRadius: '16px' }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} md={6}>
            <InfoBox>
              <Typography variant="subtitle1" fontWeight="bold">
                Caractéristiques
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">{vehicle.type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Année
                  </Typography>
                  <Typography variant="body1">{vehicle.manufactureYear}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Capacité
                  </Typography>
                  <Typography variant="body1">{vehicle.capacity} passagers</Typography>
                </Grid>
              </Grid>
            </InfoBox>
          </Grid>

          {/* Équipements */}
          <Grid item xs={12}>
            <InfoBox>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Équipements
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                {vehicle.features.hasAC && (
                  <Chip icon={<AcUnit />} label="Climatisation" variant="outlined" />
                )}
                {vehicle.features.hasWifi && <Chip icon={<Wifi />} label="Wi-Fi" variant="outlined" />}
                {vehicle.features.hasToilet && (
                  <Chip icon={<Wc />} label="Toilettes" variant="outlined" />
                )}
              </Box>
            </InfoBox>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(vehicle)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            mr: 'auto',
          }}
        >
          Supprimer
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          Fermer
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          }}
        >
          Modifier
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default VehicleDetailsDialog;
