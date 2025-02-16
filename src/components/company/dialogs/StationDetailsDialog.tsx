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
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn,
  Phone,
  Email,
  DirectionsBus,
  LocalParking,
  MeetingRoom,
  ConfirmationNumber,
  Edit as EditIcon,
  Delete as DeleteIcon,
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

interface Station {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  latitude: number;
  longitude: number;
  is_main_station: boolean;
  features: {
    hasWaitingRoom: boolean;
    hasTicketOffice: boolean;
    hasParking: boolean;
  };
  status: 'active' | 'inactive' | 'under_maintenance';
  created_at: string;
  updated_at: string;
  departures_count?: number;
  arrivals_count?: number;
  stops_count?: number;
}

interface StationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  station: Station;
  onEdit: () => void;
}

const StationDetailsDialog: React.FC<StationDetailsDialogProps> = ({
  open,
  onClose,
  station,
  onEdit,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'under_maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'under_maintenance':
        return 'En maintenance';
      default:
        return status;
    }
  };

  const handleOpenMap = () => {
    const { latitude, longitude } = station;
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Détails de la gare</Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={getStatusLabel(station.status)}
              color={getStatusColor(station.status)}
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
          {/* En-tête */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                mb: 3,
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <LocationOn color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {station.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {station.city}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {station.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleOpenMap}
                    startIcon={<LocationOn />}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Voir sur la carte
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Informations de contact */}
          <Grid item xs={12} md={6}>
            <InfoBox>
              <Phone color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Téléphone
                </Typography>
                <Typography variant="subtitle1">{station.phone}</Typography>
              </Box>
            </InfoBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoBox>
              <Email color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="subtitle1">{station.email}</Typography>
              </Box>
            </InfoBox>
          </Grid>

          {/* Capacité */}
          <Grid item xs={12}>
            <InfoBox>
              <DirectionsBus color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Capacité
                </Typography>
                <Typography variant="subtitle1">{station.capacity} bus</Typography>
              </Box>
            </InfoBox>
          </Grid>

          {/* Équipements */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Équipements
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {station.features.hasWaitingRoom && (
                <Chip
                  icon={<MeetingRoom />}
                  label="Salle d'attente"
                  color="primary"
                  variant="outlined"
                />
              )}
              {station.features.hasTicketOffice && (
                <Chip
                  icon={<ConfirmationNumber />}
                  label="Guichet"
                  color="primary"
                  variant="outlined"
                />
              )}
              {station.features.hasParking && (
                <Chip
                  icon={<LocalParking />}
                  label="Parking"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <ActionButton
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
                sx={{ borderColor: 'error.main', color: 'error.main' }}
              >
                Supprimer
              </ActionButton>
              <ActionButton
                startIcon={<EditIcon />}
                variant="contained"
                onClick={onEdit}
                sx={{
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                }}
              >
                Modifier
              </ActionButton>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </StyledDialog>
  );
};

export default StationDetailsDialog;
