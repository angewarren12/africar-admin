import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  styled,
  alpha,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocationOn,
  Phone,
  Email,
  DirectionsBus,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalParking,
  MeetingRoom,
  ConfirmationNumber,
} from '@mui/icons-material';
import AddStationDialog from './dialogs/AddStationDialog';
import StationDetailsDialog from './dialogs/StationDetailsDialog';

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

interface StationsListProps {
  companyId: number;
}

const StationsList: React.FC<StationsListProps> = ({ companyId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      setError(null);
      console.log('🔄 Chargement des gares...');
      try {
        console.log(`📡 Requête GET /api/companies/${companyId}/stations`);
        const response = await fetch(`/api/companies/${companyId}/stations`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 Données reçues:', data);
        
        if (Array.isArray(data)) {
          console.log(`✅ ${data.length} gares chargées avec succès`);
          setStations(data);
        } else {
          console.warn('⚠️ Les données reçues ne sont pas un tableau de gares');
          setStations([]);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des gares:', error);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        setStations([]);
      } finally {
        setLoading(false);
        console.log('🏁 Chargement des gares terminé');
      }
    };

    if (companyId) {
      fetchStations();
    }
  }, [companyId]);

  // Calcul des statistiques
  const activeStations = stations.filter((station) => station.status === 'active');
  const maintenanceStations = stations.filter((station) => station.status === 'under_maintenance');
  const totalCapacity = stations.reduce((sum, station) => sum + (station.capacity || 0), 0);
  const totalOccupancy = stations.reduce((sum, station) => sum + (station.departures_count || 0), 0);
  const averageOccupancy = Math.round((totalOccupancy / totalCapacity) * 100) || 0;

  const handleAddStation = async (stationData: any) => {
    console.log('➕ Création d\'une nouvelle gare...');
    console.log('📝 Données de la gare:', stationData);
    
    try {
      console.log(`📡 Requête POST /api/companies/${companyId}/stations`);
      const response = await fetch(`/api/companies/${companyId}/stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stationData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la gare');
      }

      const result = await response.json();
      console.log('✅ Gare créée avec succès:', result);

      // Recharger la liste des gares
      console.log('🔄 Rechargement de la liste des gares...');
      const companyResponse = await fetch(`/api/companies/${companyId}/stations`);
      const companyData = await companyResponse.json();
      if (Array.isArray(companyData)) {
        console.log(`✅ Liste des gares mise à jour (${companyData.length} gares)`);
        setStations(companyData);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    setIsDetailsDialogOpen(true);
  };

  const handleEditStation = () => {
    // Cette fonction sera implémentée plus tard
    console.log('Édition de la gare:', selectedStation);
  };

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <Box>
      {/* Section des statistiques */}
      <Box mb={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StyledCard>
              <Box p={2} display="flex" alignItems="center" gap={2}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}>
                  <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {activeStations.length}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="text.secondary">
                      Gares actives
                    </Typography>
                    {maintenanceStations.length > 0 && (
                      <Chip
                        label={`${maintenanceStations.length} en maintenance`}
                        size="small"
                        color="warning"
                        sx={{ height: 20 }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StyledCard>
              <Box p={2} display="flex" alignItems="center" gap={2}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}>
                  <DirectionsBus sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalCapacity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacité totale
                  </Typography>
                </Box>
              </Box>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StyledCard>
              <Box p={2} display="flex" alignItems="center" gap={2}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}>
                  <LocalParking sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalOccupancy}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="text.secondary">
                      Véhicules stationnés
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StyledCard>
              <Box p={2} display="flex" alignItems="center" gap={2}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.success.main, 0.1) }}>
                  <MeetingRoom sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {averageOccupancy}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Taux d'occupation
                  </Typography>
                </Box>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>

      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Liste des gares</Typography>
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
          Ajouter une gare
        </Button>
      </Box>

      {/* Barre de recherche */}
      <TextField
        fullWidth
        placeholder="Rechercher une gare..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 3,
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

      {/* Liste des gares */}
      <Grid container spacing={3}>
        {filteredStations.map((station) => (
          <Grid item xs={12} md={6} key={station.id}>
            <StyledCard
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: (theme) => `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
              onClick={() => handleStationClick(station)}
            >
              <Box sx={{ p: 3 }}>
                {/* En-tête de la carte */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" gap={2}>
                    <LocationOn color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {station.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {station.city}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={getStatusLabel(station.status)}
                    color={getStatusColor(station.status)}
                    size="small"
                    sx={{ borderRadius: '16px' }}
                  />
                </Box>

                {/* Informations de la gare */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{station.phone}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">{station.email}</Typography>
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
                        Occupation
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DirectionsBus color="primary" />
                        <Typography variant="body2">
                          {station.departures_count}/{station.capacity} bus
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(station.departures_count / station.capacity) * 100}
                        sx={{ mt: 1, borderRadius: 1 }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Équipements */}
                <Box display="flex" gap={1} mt={2}>
                  {station.features.hasWaitingRoom && (
                    <Chip
                      icon={<MeetingRoom />}
                      label="Salle d'attente"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {station.features.hasTicketOffice && (
                    <Chip
                      icon={<ConfirmationNumber />}
                      label="Guichet"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {station.features.hasParking && (
                    <Chip
                      icon={<LocalParking />}
                      label="Parking"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Dialogues */}
      <AddStationDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddStation}
      />

      {selectedStation && (
        <StationDetailsDialog
          open={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          station={selectedStation}
          onEdit={handleEditStation}
        />
      )}
    </Box>
  );
};

export default StationsList;
