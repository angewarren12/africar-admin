import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  styled,
  alpha,
  Skeleton,
  Fade,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Business,
  CheckCircle,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  DirectionsBus,
  Person,
  Store as StoreIcon,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const CompanyCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
    theme.palette.background.paper,
    0.95
  )} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledStatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  background: alpha(theme.palette.primary.main, 0.05),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.1),
  }
}));

// Types
interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  description?: string;
  website?: string;
  whatsapp?: string;
  manager_name?: string;
  manager_position?: string;
  status: 'active' | 'inactive';
  coverage_areas?: string[];
  transport_type?: string[];
  stations_count?: number;
  drivers_count?: number;
  vehicles_count?: number;
  created_at: string;
  updated_at: string;
}

const Companies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addressFilter, setAddressFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/companies`);
      setCompanies(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des compagnies:', err);
      setError('Impossible de charger les compagnies. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleRefresh = () => {
    fetchCompanies();
  };

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3].map((item) => (
        <Grid item xs={12} md={4} key={item}>
          <Card sx={{ p: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={120} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Filtres disponibles
  const addresses = Array.from(new Set(companies.map(company => company.address)));
  const statuses = ['active', 'inactive'];

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status);
    handleFilterClose();
  };

  const handleAddressFilterChange = (address: string | null) => {
    setAddressFilter(address);
    handleFilterClose();
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || company.status === statusFilter;
    const matchesAddress = !addressFilter || company.address === addressFilter;
    return matchesSearch && matchesStatus && matchesAddress;
  });

  const renderCompanyCard = (company: Company) => (
    <CompanyCard onClick={() => navigate(`/companies/${company.id}`)}>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* En-tête de la carte */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {company.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {company.description || 'Aucune description'}
            </Typography>
          </Box>
          <Chip
            label={company.status === 'active' ? 'Actif' : 'Inactif'}
            color={company.status === 'active' ? 'success' : 'error'}
            size="small"
          />
        </Box>

        {/* Informations de contact */}
        <Stack spacing={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">{company.city || company.address}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Email fontSize="small" color="action" />
            <Typography variant="body2">{company.email}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Phone fontSize="small" color="action" />
            <Typography variant="body2">{company.phone}</Typography>
          </Box>
        </Stack>

        {/* Statistiques */}
        <Box display="flex" gap={2} mt={2}>
          <Tooltip title="Gares">
            <StyledStatBox>
              <StoreIcon color="primary" />
              <Typography variant="body2" fontWeight="medium">{company.stations_count || 0}</Typography>
            </StyledStatBox>
          </Tooltip>
          
          <Tooltip title="Drivers">
            <StyledStatBox>
              <Person color="primary" />
              <Typography variant="body2" fontWeight="medium">{company.drivers_count || 0}</Typography>
            </StyledStatBox>
          </Tooltip>
          
          <Tooltip title="Véhicules">
            <StyledStatBox>
              <DirectionsBus color="primary" />
              <Typography variant="body2" fontWeight="medium">{company.vehicles_count || 0}</Typography>
            </StyledStatBox>
          </Tooltip>
        </Box>

        {/* Zones de couverture et types de transport */}
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Zones de couverture
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {company.coverage_areas?.map((area) => (
              <Chip
                key={area}
                label={area}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            )) || 'Aucune zone définie'}
          </Box>
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Types de transport
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {company.transport_type && company.transport_type.length > 0 ? (
              company.transport_type.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Aucun type défini
              </Typography>
            )}
          </Box>
        </Box>

        {/* Date de création */}
        <Typography variant="caption" color="text.secondary" mt={2}>
          Créé le {format(new Date(company.created_at), 'dd MMMM yyyy', { locale: fr })}
        </Typography>
      </Box>
    </CompanyCard>
  );

  return (
    <Container maxWidth={false}>
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Compagnies de Transport
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/companies/new')}
            >
              Nouvelle Compagnie
            </Button>
          </Box>
        </Box>
        <Typography color="text.secondary">
          Gérez les compagnies de transport et leur conformité
        </Typography>
      </Box>

      {/* Barre de recherche et filtres */}
      <StyledCard sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher une compagnie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1}>
              {statusFilter && (
                <Chip
                  label={`Statut: ${statusFilter === 'active' ? 'Actif' : 'Inactif'}`}
                  onDelete={() => handleStatusFilterChange(null)}
                  color={statusFilter === 'active' ? 'success' : 'error'}
                  size="small"
                />
              )}
              {addressFilter && (
                <Chip
                  label={`Adresse: ${addressFilter}`}
                  onDelete={() => handleAddressFilterChange(null)}
                  color="primary"
                  size="small"
                />
              )}
              <Button
                startIcon={<FilterIcon />}
                onClick={handleFilterClick}
                size="small"
                variant="outlined"
              >
                Filtres
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StyledCard>

      {/* Menu des filtres */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        TransitionComponent={Fade}
      >
        <div key="status-section">
          <MenuItem disabled>
            <Typography variant="subtitle2">Filtrer par statut</Typography>
          </MenuItem>
          {statuses.map((status) => (
            <MenuItem
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              selected={statusFilter === status}
            >
              {status === 'active' ? 'Actif' : 'Inactif'}
            </MenuItem>
          ))}
        </div>
        <div key="address-section">
          <MenuItem disabled>
            <Typography variant="subtitle2">Filtrer par adresse</Typography>
          </MenuItem>
          {addresses.map((address) => (
            <MenuItem
              key={address}
              onClick={() => handleAddressFilterChange(address)}
              selected={addressFilter === address}
            >
              {address}
            </MenuItem>
          ))}
        </div>
      </Menu>

      {/* Liste des compagnies */}
      {loading ? (
        renderSkeleton()
      ) : error ? (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredCompanies.map((company) => (
            <Grid item xs={12} md={4} key={company.id}>
              {renderCompanyCard(company)}
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Companies;
