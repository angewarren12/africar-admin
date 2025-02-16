import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  styled,
  alpha,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Chip,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import {
  DirectionsBus,
  Person,
  Train,
  Route,
  Info,
  Description,
  Business,
  Email,
  Phone,
  LocationCity,
  Public,
  Event,
  Update,
  Circle as CircleIcon,
  LocationOn,
  Search,
  MoreVert,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TripList from '../components/company/TripList';
import StationsList from '../components/company/StationsList';
import VehicleList from '../components/company/VehicleList';
import PersonnelList from '../components/company/PersonnelList';
import RouteList from '../components/company/RouteList';
import CompanyInfo from '../components/company/CompanyInfo';
import LegalDocuments from '../components/company/LegalDocuments';
import { parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  padding: theme.spacing(2, 3),
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: alpha(theme.palette.text.primary, 0.7),
  '&:hover': {
    color: theme.palette.text.primary,
    opacity: 1,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.action.selected,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

interface CompanyDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: string;
  created_at: string;
  drivers_count: number;
  trips_count: number;
  stations_count: number;
  vehicles_count: number;
  updated_at?: string;
  documents?: any[];
}

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`/api/companies/${id}`);
        setCompany(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des détails de la compagnie');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('ID de la compagnie:', id);
      fetchCompanyDetails();
    }
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('Changement d\'onglet vers:', newValue);
    console.log('Nom de l\'onglet:', [
      'Informations',
      'Véhicules',
      'Personnel',
      'Routes',
      'Trajets',
      'Stations',
      'Documents',
    ][newValue]);
    
    // Si on clique sur l'onglet Trajets
    if (newValue === 4) {
      console.log('=== CHARGEMENT DES TRAJETS ===');
      console.log('ID de la compagnie:', id);
    }
    
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Informations', icon: <Info /> },
    { label: 'Véhicules', icon: <DirectionsBus /> },
    { label: 'Personnel', icon: <Person /> },
    { label: 'Routes', icon: <Route /> },
    { label: 'Trajets', icon: <DirectionsBus /> },
    { label: 'Stations', icon: <LocationOn /> },
    { label: 'Documents', icon: <Description /> },
  ];

  // Composant pour les informations
  const InformationTab = () => {
    return (
      <Box>
        {/* En-tête avec les statistiques principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                height: '100%',
                background: (theme) => alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: (theme) => alpha(theme.palette.primary.main, 0.15),
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {company?.drivers_count}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Drivers
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                height: '100%',
                background: (theme) => alpha(theme.palette.success.main, 0.1),
                '&:hover': {
                  background: (theme) => alpha(theme.palette.success.main, 0.15),
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: 'success.main',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Train />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {company?.stations_count}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gares
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                height: '100%',
                background: (theme) => alpha(theme.palette.info.main, 0.1),
                '&:hover': {
                  background: (theme) => alpha(theme.palette.info.main, 0.15),
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: 'info.main',
                    width: 48,
                    height: 48,
                  }}
                >
                  <DirectionsBus />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="info.main">
                    {company?.vehicles_count}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Véhicules
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                height: '100%',
                background: (theme) => alpha(theme.palette.warning.main, 0.1),
                '&:hover': {
                  background: (theme) => alpha(theme.palette.warning.main, 0.15),
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: 'warning.main',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Route />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {company?.trips_count}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Trajets
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Informations détaillées */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  boxShadow: (theme) => theme.shadows[4],
                  transition: 'all 0.3s',
                },
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 56,
                      height: 56,
                    }}
                  >
                    {company?.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {company?.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={company?.status === 'active' ? 'Actif' : 'Inactif'}
                        color={company?.status === 'active' ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Créée le {format(parseISO(company?.created_at), 'dd/MM/yyyy')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<Email color="primary" />}
                      label="Email"
                      value={company?.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<Phone color="primary" />}
                      label="Téléphone"
                      value={company?.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InfoRow
                      icon={<LocationOn color="primary" />}
                      label="Adresse"
                      value={company?.address}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<LocationCity color="primary" />}
                      label="Ville"
                      value={company?.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<Public color="primary" />}
                      label="Pays"
                      value={company?.country}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  boxShadow: (theme) => theme.shadows[4],
                  transition: 'all 0.3s',
                },
              }}
            >
              <CardHeader 
                title="Activité récente"
                titleTypographyProps={{ variant: 'h6' }}
                sx={{
                  '& .MuiCardHeader-title': {
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  },
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                }}
              />
              <Divider />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Derniers trajets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company?.trips_count} trajets au total
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Drivers actifs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company?.drivers_count} drivers enregistrés
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Véhicules disponibles
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company?.vehicles_count} véhicules dans la flotte
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Couverture
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company?.stations_count} gares desservies
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Composant réutilisable pour les lignes d'information
  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Box display="flex" alignItems="center" gap={2}>
      {icon}
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1 }}>
        {value}
      </Typography>
    </Box>
  );

  // Afficher le bon contenu selon l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <InformationTab />;
      case 1:
        return <VehicleList companyId={company?.id} />;
      case 2:
        return <PersonnelList companyId={company?.id} />;
      case 3:
        return <RouteList companyId={company?.id} />;
      case 4:
        return <TripList companyId={company?.id} />;
      case 5:
        return <StationsList companyId={company?.id} />;
      case 6:
        return <LegalDocuments companyId={company?.id} documents={company?.documents} />;
      default:
        return <InformationTab />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!company) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="error">
          Compagnie non trouvée
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}
    </Container>
  );
};

export default CompanyDetails;
