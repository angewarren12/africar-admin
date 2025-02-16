import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  IconButton,
  styled,
  alpha,
  Chip,
  Rating,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  DirectionsBus,
  Timer,
  Star,
  Groups,
  Warning,
  Report,
  LocalGasStation,
  Build,
  ThumbUp,
  ThumbDown,
  MedicalServices,
  Security,
  DirectionsCar,
  Badge,
  Person,
  Email,
  Phone,
  LocationOn,
  Store,
  CalendarMonth,
  Payment,
  QrCode,
  ConfirmationNumber,
} from '@mui/icons-material';
import { StaffMember } from '../../../types/staff';
import { formatDate } from '../../../utils/dateUtils';

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
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.primary.main, 0.05),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  background: alpha(theme.palette.background.paper, 0.6),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  height: 8,
  width: '100%',
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  position: 'relative',
  overflow: 'hidden',
}));

const ProgressFill = styled(Box)<{ value: number }>(({ theme, value }) => ({
  height: '100%',
  width: `${value}%`,
  borderRadius: 4,
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  transition: 'width 0.5s ease-in-out',
}));

interface Station {
  id: number;
  name: string;
}

interface StaffDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  staff: StaffMember;
  station?: Station;
  onEdit: () => void;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({
  open,
  onClose,
  staff,
  station,
  onEdit,
}) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'driver':
        return 'Chauffeur';
      case 'cashier':
        return 'Caissier';
      case 'ticketController':
        return 'Contrôleur de tickets';
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'onLeave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'onLeave':
        return 'En congé';
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderDriverStats = () => {
    if (staff.role !== 'driver' || !staff.driverStats) return null;

    const stats = staff.driverStats;
    const performanceColor = stats.performanceScore >= 80 ? 'success' : stats.performanceScore >= 60 ? 'warning' : 'error';

    return (
      <>
        <Grid item xs={12}>
          <InfoBox>
            <Typography variant="subtitle1" fontWeight="bold">
              Performance globale
            </Typography>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Score de performance
                </Typography>
                <Typography variant="h6" color={`${performanceColor}.main`}>
                  {stats.performanceScore}%
                </Typography>
              </Box>
              <ProgressBar>
                <ProgressFill value={stats.performanceScore} />
              </ProgressBar>
            </Box>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6} md={3}>
                <StatBox>
                  <DirectionsBus color="primary" />
                  <Box>
                    <Typography variant="h6">{stats.totalTrips}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trajets totaux
                    </Typography>
                  </Box>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={3}>
                <StatBox>
                  <Timer color="primary" />
                  <Box>
                    <Typography variant="h6">{stats.totalHours}h</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Heures totales
                    </Typography>
                  </Box>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={3}>
                <StatBox>
                  <Star color="primary" />
                  <Box>
                    <Typography variant="h6">{stats.rating.toFixed(1)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Note moyenne
                    </Typography>
                  </Box>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={3}>
                <StatBox>
                  <Groups color="primary" />
                  <Box>
                    <Typography variant="h6">{stats.totalPassengers}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Passagers totaux
                    </Typography>
                  </Box>
                </StatBox>
              </Grid>
            </Grid>
          </InfoBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoBox>
            <Typography variant="subtitle1" fontWeight="bold">
              Statistiques du mois
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <DirectionsBus color="primary" />
              <Typography>
                {stats.completedTripsLastMonth} trajets effectués
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Timer color="primary" />
              <Typography>{stats.hoursLastMonth} heures de conduite</Typography>
            </Box>
          </InfoBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoBox>
            <Typography variant="subtitle1" fontWeight="bold">
              Sécurité et maintenance
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Warning color={stats.accidents > 0 ? 'error' : 'success'} />
              <Typography>
                {stats.accidents} accident{stats.accidents !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Report color={stats.incidents > 2 ? 'error' : 'success'} />
              <Typography>
                {stats.incidents} incident{stats.incidents !== 1 ? 's' : ''} signalé{stats.incidents !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalGasStation color="primary" />
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Efficacité carburant
                </Typography>
                <ProgressBar>
                  <ProgressFill value={stats.fuelEfficiencyScore} />
                </ProgressBar>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Build color="primary" />
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Score maintenance
                </Typography>
                <ProgressBar>
                  <ProgressFill value={stats.maintenanceScore} />
                </ProgressBar>
              </Box>
            </Box>
          </InfoBox>
        </Grid>

        <Grid item xs={12}>
          <InfoBox>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">
                Retours clients
              </Typography>
              <Box display="flex" gap={2}>
                <Chip
                  icon={<ThumbUp />}
                  label={`${stats.customerFeedback.positive} positifs`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<ThumbDown />}
                  label={`${stats.customerFeedback.negative} négatifs`}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Box mt={2}>
              {stats.customerFeedback.comments.slice(0, 3).map((comment, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Rating value={comment.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(comment.date)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{comment.comment}</Typography>
                </Box>
              ))}
            </Box>
          </InfoBox>
        </Grid>

        {staff.specializations && staff.specializations.length > 0 && (
          <Grid item xs={12}>
            <InfoBox>
              <Typography variant="subtitle1" fontWeight="bold">
                Spécialisations
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {staff.specializations.map((spec) => (
                  <Chip
                    key={spec}
                    label={spec}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </InfoBox>
          </Grid>
        )}

        {staff.certifications && (
          <Grid item xs={12}>
            <InfoBox>
              <Typography variant="subtitle1" fontWeight="bold">
                Certifications
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(staff.certifications).map(([key, cert]) => (
                  <Grid item xs={12} sm={6} md={3} key={key}>
                    <Chip
                      icon={getCertificationIcon(key)}
                      label={getCertificationLabel(key)}
                      color={cert.obtained ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ width: '100%' }}
                    />
                    {cert.obtained && cert.expiryDate && (
                      <Typography variant="caption" display="block" mt={0.5} color="text.secondary">
                        Expire le {formatDate(cert.expiryDate)}
                      </Typography>
                    )}
                  </Grid>
                ))}
              </Grid>
            </InfoBox>
          </Grid>
        )}
      </>
    );
  };

  const getCertificationIcon = (certType: string) => {
    switch (certType) {
      case 'firstAid':
        return <MedicalServices />;
      case 'safety':
        return <Security />;
      case 'defensiveDriving':
        return <DirectionsCar />;
      case 'hazardousGoods':
        return <Warning />;
      default:
        return <Badge />;
    }
  };

  const getCertificationLabel = (certType: string) => {
    switch (certType) {
      case 'firstAid':
        return 'Premiers secours';
      case 'safety':
        return 'Sécurité';
      case 'defensiveDriving':
        return 'Conduite défensive';
      case 'hazardousGoods':
        return 'Matières dangereuses';
      default:
        return certType;
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Détails du membre</Typography>
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
          <Person sx={{ fontSize: 64, color: 'primary.main' }} />
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              {staff.firstName} {staff.lastName}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
              <Chip
                label={getRoleLabel(staff.role)}
                color="primary"
                sx={{ borderRadius: '16px' }}
              />
              <Chip
                label={getStatusLabel(staff.status)}
                color={getStatusColor(staff.status)}
                sx={{ borderRadius: '16px' }}
              />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Contact */}
          <Grid item xs={12} md={6}>
            <InfoBox>
              <Typography variant="subtitle1" fontWeight="bold">
                Contact
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Email color="primary" />
                <Typography>{staff.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone color="primary" />
                <Typography>{staff.phone}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn color="primary" />
                <Typography>
                  {staff.address}, {staff.city}
                </Typography>
              </Box>
            </InfoBox>
          </Grid>

          {/* Informations professionnelles */}
          <Grid item xs={12} md={6}>
            <InfoBox>
              <Typography variant="subtitle1" fontWeight="bold">
                Informations professionnelles
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Badge color="primary" />
                <Typography>ID: {staff.id}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonth color="primary" />
                <Typography>Date d'entrée: {formatDate(staff.joinDate)}</Typography>
              </Box>
              {station && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Store color="primary" />
                  <Typography>Gare assignée: {station.name}</Typography>
                </Box>
              )}
            </InfoBox>
          </Grid>

          {/* Informations spécifiques au rôle */}
          {staff.role === 'driver' && staff.license && (
            <Grid item xs={12}>
              <InfoBox>
                <Typography variant="subtitle1" fontWeight="bold">
                  Informations chauffeur
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Badge color="primary" />
                  <Typography>Permis: {staff.license.number}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarMonth color="primary" />
                  <Typography>
                    Expiration du permis: {formatDate(staff.license.expiryDate)}
                  </Typography>
                </Box>
                {staff.vehicleTypes && (
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {staff.vehicleTypes.map((type) => (
                      <Chip
                        key={type}
                        icon={<DirectionsBus />}
                        label={type}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </InfoBox>
            </Grid>
          )}

          {(staff.role === 'cashier' || staff.role === 'ticketController') && (
            <Grid item xs={12}>
              <InfoBox>
                <Typography variant="subtitle1" fontWeight="bold">
                  Autorisations
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {staff.canProcessPayments && (
                    <Chip
                      icon={<Payment />}
                      label="Gestion de caisse"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {staff.canScanTickets && (
                    <Chip
                      icon={<QrCode />}
                      label="Scan de QR codes"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {staff.canValidateManually && (
                    <Chip
                      icon={<ConfirmationNumber />}
                      label="Validation manuelle"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>
              </InfoBox>
            </Grid>
          )}
          {/* Ajout des statistiques du chauffeur */}
          {staff.role === 'driver' && renderDriverStats()}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Fermer
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default StaffDetailsDialog;
