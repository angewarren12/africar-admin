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
  Rating,
  LinearProgress,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person,
  Email,
  Phone,
  LocationOn,
  DirectionsBus,
  Edit as EditIcon,
  Timer,
  Star,
  Badge,
  MedicalServices,
  Security,
  CalendarMonth,
  DriveEta,
  AccessTime,
  Route,
} from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    background: theme.palette.background.paper,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontSize: '3rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.primary.main, 0.03),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  textAlign: 'center',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
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

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  license: {
    number: string;
    expiryDate: string;
  };
  birthDate: string;
  address: string;
  city: string;
  experience: number;
  vehicleTypes: string[];
  employmentType: 'fullTime' | 'partTime';
  certifications: {
    firstAid: boolean;
    safety: boolean;
  };
  status: 'available' | 'onTrip' | 'onBreak' | 'offDuty';
  rating: number;
  totalTrips: number;
  totalHours: number;
}

interface DriverDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  driver: Driver;
  onEdit: () => void;
}

const DriverDetailsDialog: React.FC<DriverDetailsDialogProps> = ({
  open,
  onClose,
  driver,
  onEdit,
}) => {
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'available':
        return 'success';
      case 'onTrip':
      case 'onBreak':
        return 'warning';
      case 'offDuty':
        return 'error';
      default:
        return 'success';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'onTrip':
        return 'En trajet';
      case 'onBreak':
        return 'En pause';
      case 'offDuty':
        return 'Hors service';
      default:
        return status;
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="600">Détails du chauffeur</Typography>
          <Box>
            <IconButton onClick={onEdit} size="small" color="primary" sx={{ mr: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ p: 2 }}>
          {/* En-tête avec photo et statut */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <StyledAvatar>
              {driver.firstName[0]}{driver.lastName[0]}
            </StyledAvatar>
            <Typography variant="h5" gutterBottom fontWeight="600">
              {driver.firstName} {driver.lastName}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <StatusChip
                label={getStatusLabel(driver.status)}
                color={getStatusColor(driver.status)}
              />
              <Box display="flex" alignItems="center" gap={0.5}>
                <Rating value={driver.rating} readOnly precision={0.5} size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({driver.rating.toFixed(1)})
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Statistiques */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <StatBox>
                <DriveEta sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                <Typography variant="h4" color="primary.main" fontWeight="600">
                  {driver.totalTrips}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trajets effectués
                </Typography>
              </StatBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatBox>
                <AccessTime sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                <Typography variant="h4" color="primary.main" fontWeight="600">
                  {driver.totalHours}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Heures de conduite
                </Typography>
              </StatBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatBox>
                <Route sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                <Typography variant="h4" color="primary.main" fontWeight="600">
                  {driver.experience}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Années d'expérience
                </Typography>
              </StatBox>
            </Grid>
          </Grid>

          {/* Informations personnelles */}
          <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
            Informations personnelles
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <InfoItem>
                  <Email />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography>{driver.email}</Typography>
                  </Box>
                </InfoItem>
                <Divider sx={{ my: 1.5 }} />
                <InfoItem>
                  <Phone />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Téléphone</Typography>
                    <Typography>{driver.phone}</Typography>
                  </Box>
                </InfoItem>
                <Divider sx={{ my: 1.5 }} />
                <InfoItem>
                  <LocationOn />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Adresse</Typography>
                    <Typography>{driver.address}</Typography>
                    <Typography variant="body2" color="text.secondary">{driver.city}</Typography>
                  </Box>
                </InfoItem>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <InfoItem>
                  <Badge />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Numéro de permis</Typography>
                    <Typography>{driver.license.number}</Typography>
                  </Box>
                </InfoItem>
                <Divider sx={{ my: 1.5 }} />
                <InfoItem>
                  <CalendarMonth />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Date d'expiration du permis</Typography>
                    <Typography>{formatDate(driver.license.expiryDate)}</Typography>
                  </Box>
                </InfoItem>
                <Divider sx={{ my: 1.5 }} />
                <InfoItem>
                  <DirectionsBus />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Types de véhicules</Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
                      {driver.vehicleTypes.map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          sx={{ 
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </InfoItem>
              </Paper>
            </Grid>
          </Grid>

          {/* Certifications */}
          <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
            Certifications
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: (theme) => 
                    driver.certifications.firstAid 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1)
                }}
              >
                <InfoItem>
                  <MedicalServices />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Premiers secours</Typography>
                    <Typography color={driver.certifications.firstAid ? 'success.main' : 'error.main'}>
                      {driver.certifications.firstAid ? 'Certifié' : 'Non certifié'}
                    </Typography>
                  </Box>
                </InfoItem>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: (theme) => 
                    driver.certifications.safety 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1)
                }}
              >
                <InfoItem>
                  <Security />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Sécurité routière</Typography>
                    <Typography color={driver.certifications.safety ? 'success.main' : 'error.main'}>
                      {driver.certifications.safety ? 'Certifié' : 'Non certifié'}
                    </Typography>
                  </Box>
                </InfoItem>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default DriverDetailsDialog;
