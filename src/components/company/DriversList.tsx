import React, { useState } from 'react';
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
  Rating,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Person,
  Email,
  Phone,
  DirectionsBus,
  Timer,
  MedicalServices,
  Security,
} from '@mui/icons-material';
import AddDriverDialog from './dialogs/AddDriverDialog';
import DriverDetailsDialog from './dialogs/DriverDetailsDialog';

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

// Données de test
const mockDrivers: Driver[] = [
  {
    id: 1,
    firstName: 'Kouamé',
    lastName: 'Kouassi',
    email: 'kouame.kouassi@utb.ci',
    phone: '+225 0708091011',
    license: {
      number: 'DL123456',
      expiryDate: '2026-12-31',
    },
    birthDate: '1985-06-15',
    address: '123 Rue du Commerce',
    city: 'Abidjan',
    experience: 8,
    vehicleTypes: ['bus', 'minibus'],
    employmentType: 'fullTime',
    certifications: {
      firstAid: true,
      safety: true,
    },
    status: 'available',
    rating: 4.8,
    totalTrips: 1250,
    totalHours: 4800,
  },
  {
    id: 2,
    firstName: 'Seydou',
    lastName: 'Diallo',
    email: 'seydou.diallo@utb.ci',
    phone: '+225 0102030405',
    license: {
      number: 'DL789012',
      expiryDate: '2025-10-15',
    },
    birthDate: '1990-03-22',
    address: '456 Avenue des Jardins',
    city: 'Yamoussoukro',
    experience: 5,
    vehicleTypes: ['minibus', 'van'],
    employmentType: 'fullTime',
    certifications: {
      firstAid: true,
      safety: false,
    },
    status: 'onTrip',
    rating: 4.5,
    totalTrips: 850,
    totalHours: 3200,
  },
];

const DriversList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);

  const handleAddDriver = (driverData: any) => {
    const newDriver = {
      ...driverData,
      id: drivers.length + 1,
    };
    setDrivers([...drivers, newDriver]);
  };

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailsDialogOpen(true);
  };

  const handleEditDriver = () => {
    // Cette fonction sera implémentée plus tard
    console.log('Édition du chauffeur:', selectedDriver);
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && driver.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'onTrip':
        return 'info';
      case 'onBreak':
        return 'warning';
      case 'offDuty':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
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

  return (
    <Box>
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Liste des chauffeurs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          }}
        >
          Ajouter un chauffeur
        </Button>
      </Box>

      {/* Filtres */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Rechercher un chauffeur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Statut"
              sx={{
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <MenuItem value="all">Tous les statuts</MenuItem>
              <MenuItem value="available">Disponible</MenuItem>
              <MenuItem value="onTrip">En trajet</MenuItem>
              <MenuItem value="onBreak">En pause</MenuItem>
              <MenuItem value="offDuty">Hors service</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Liste des chauffeurs */}
      <Grid container spacing={3}>
        {filteredDrivers.map((driver) => (
          <Grid item xs={12} md={6} key={driver.id}>
            <StyledCard
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: (theme) => `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
              onClick={() => handleDriverClick(driver)}
            >
              <Box sx={{ p: 3 }}>
                {/* En-tête de la carte */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" gap={2}>
                    <Person color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {driver.firstName} {driver.lastName}
                      </Typography>
                      <Rating value={driver.rating} readOnly size="small" precision={0.5} />
                    </Box>
                  </Box>
                  <Chip
                    label={getStatusLabel(driver.status)}
                    color={getStatusColor(driver.status)}
                    size="small"
                    sx={{ borderRadius: '16px' }}
                  />
                </Box>

                {/* Informations du chauffeur */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">{driver.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{driver.phone}</Typography>
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
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DirectionsBus fontSize="small" color="primary" />
                          <Typography variant="body2">{driver.totalTrips} trajets</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Timer fontSize="small" color="primary" />
                          <Typography variant="body2">{driver.totalHours}h</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Certifications et types de véhicules */}
                <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                  {driver.certifications.firstAid && (
                    <Chip
                      icon={<MedicalServices />}
                      label="Premiers secours"
                      size="small"
                      variant="outlined"
                      color="success"
                    />
                  )}
                  {driver.certifications.safety && (
                    <Chip
                      icon={<Security />}
                      label="Sécurité"
                      size="small"
                      variant="outlined"
                      color="success"
                    />
                  )}
                  {driver.vehicleTypes.map((type) => (
                    <Chip
                      key={type}
                      icon={<DirectionsBus />}
                      label={type}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Dialogues */}
      <AddDriverDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddDriver}
      />

      {selectedDriver && (
        <DriverDetailsDialog
          open={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          driver={selectedDriver}
          onEdit={handleEditDriver}
        />
      )}
    </Box>
  );
};

export default DriversList;
