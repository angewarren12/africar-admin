import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  styled,
  alpha,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn,
  AccessTime,
  DirectionsBus,
  Person,
  Phone,
  Email,
  AttachMoney,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
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

const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  background: alpha(theme.palette.primary.main, 0.05),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
}));

interface TripDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  trip: {
    id: number;
    departureStation: string;
    arrivalStation: string;
    departureTime: string;
    arrivalTime: string;
    status: 'onTime' | 'delayed' | 'completed' | 'cancelled';
    driver: {
      name: string;
      photo: string;
      phone: string;
      email: string;
    };
    vehicle: {
      registrationNumber: string;
      model: string;
      capacity: number;
    };
    passengers: number;
    maxPassengers: number;
    price: number;
    progress: number;
  };
}

const TripDetailsDialog: React.FC<TripDetailsDialogProps> = ({ open, onClose, trip }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onTime':
        return 'success';
      case 'delayed':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'onTime':
        return 'À l\'heure';
      case 'delayed':
        return 'Retardé';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Détails du trajet #{trip.id}</Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={getStatusLabel(trip.status)}
              color={getStatusColor(trip.status)}
              size="small"
              sx={{ borderRadius: '16px', fontWeight: 600 }}
            />
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Informations sur le trajet */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                mb: 3,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <LocationOn color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Départ
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {trip.departureStation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(trip.departureTime).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <LocationOn color="error" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Arrivée
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {trip.arrivalStation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(trip.arrivalTime).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Informations sur le chauffeur */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Chauffeur
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Box display="flex" gap={2} mb={2}>
                <Avatar src={trip.driver.photo} alt={trip.driver.name} sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {trip.driver.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{trip.driver.phone}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{trip.driver.email}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Informations sur le véhicule */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Véhicule
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Box display="flex" gap={2}>
                <DirectionsBus sx={{ fontSize: 64, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {trip.vehicle.registrationNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trip.vehicle.model}
                  </Typography>
                  <Typography variant="body2">
                    Capacité: {trip.vehicle.capacity} places
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Informations sur les passagers et le prix */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoBox>
                  <Person color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Passagers
                    </Typography>
                    <Typography variant="h6">
                      {trip.passengers}/{trip.maxPassengers}
                    </Typography>
                  </Box>
                </InfoBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoBox>
                  <AttachMoney color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Prix du billet
                    </Typography>
                    <Typography variant="h6">{trip.price.toLocaleString()} FCFA</Typography>
                  </Box>
                </InfoBox>
              </Grid>
            </Grid>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <ActionButton startIcon={<PrintIcon />} variant="outlined">
                Imprimer
              </ActionButton>
              <ActionButton
                startIcon={<EditIcon />}
                variant="contained"
                sx={{
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                }}
              >
                Modifier
              </ActionButton>
              {trip.status !== 'cancelled' && (
                <ActionButton
                  startIcon={<CancelIcon />}
                  variant="contained"
                  color="error"
                  sx={{ bgcolor: 'error.main' }}
                >
                  Annuler
                </ActionButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </StyledDialog>
  );
};

export default TripDetailsDialog;
