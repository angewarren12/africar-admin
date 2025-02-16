import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Avatar,
  Chip,
  Divider,
  Tab,
  Tabs,
  Button,
  styled,
  Paper,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  Edit,
  Block,
  DirectionsBus,
  History,
  Star,
  Comment,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  overflow: 'visible',
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  margin: '-60px auto 20px auto',
}));

interface Trip {
  id: string;
  date: string;
  from: string;
  to: string;
  company: string;
  status: 'completed' | 'cancelled' | 'upcoming';
  price: number;
}

interface Review {
  id: string;
  date: string;
  rating: number;
  comment: string;
  company: string;
}

// Mock data
const mockClient = {
  id: '1',
  name: 'Jean Kouassi',
  email: 'jean.kouassi@email.com',
  phone: '+225 0123456789',
  location: 'Abidjan, Côte d\'Ivoire',
  joinDate: '2024-01-15',
  avatar: '/avatars/1.jpg',
  status: 'active',
  totalTrips: 12,
  totalSpent: 150000,
  averageRating: 4.5,
  favoriteCompanies: ['UTB Transport', 'Express Transport'],
  trips: [
    {
      id: '1',
      date: '2024-02-01',
      from: 'Abidjan',
      to: 'Yamoussoukro',
      company: 'UTB Transport',
      status: 'completed',
      price: 15000,
    },
    {
      id: '2',
      date: '2024-02-15',
      from: 'Yamoussoukro',
      to: 'Bouaké',
      company: 'Express Transport',
      status: 'upcoming',
      price: 12000,
    },
  ] as Trip[],
  reviews: [
    {
      id: '1',
      date: '2024-02-01',
      rating: 4,
      comment: 'Excellent service, chauffeur très professionnel',
      company: 'UTB Transport',
    },
    {
      id: '2',
      date: '2024-01-15',
      rating: 5,
      comment: 'Voyage très confortable, à l\'heure',
      company: 'Express Transport',
    },
  ] as Review[],
};

const ClientDetails: React.FC = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = React.useState(0);
  const client = mockClient; // À remplacer par un appel API avec l'ID

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'upcoming':
        return 'info';
      default:
        return 'default';
    }
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Aperçu
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Statistiques
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Total Trajets</Typography>
                    <Typography variant="h4">{client.totalTrips}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Dépenses Totales</Typography>
                    <Typography variant="h4">{client.totalSpent.toLocaleString()} FCFA</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Note Moyenne</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h4">{client.averageRating}</Typography>
                      <Star color="warning" sx={{ ml: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Membre depuis</Typography>
                    <Typography variant="h6">
                      {new Date(client.joinDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Compagnies Préférées
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {client.favoriteCompanies.map((company) => (
                    <Chip
                      key={company}
                      label={company}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </StyledCard>
            </Grid>
          </Grid>
        );
      case 1: // Trajets
        return (
          <Grid container spacing={2}>
            {client.trips.map((trip) => (
              <Grid item xs={12} key={trip.id}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography>
                        {new Date(trip.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Trajet
                      </Typography>
                      <Typography>
                        {trip.from} → {trip.to}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Compagnie
                      </Typography>
                      <Typography>{trip.company}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Prix
                      </Typography>
                      <Typography>{trip.price.toLocaleString()} FCFA</Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Chip
                        label={trip.status}
                        color={getStatusColor(trip.status)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );
      case 2: // Avis
        return (
          <Grid container spacing={2}>
            {client.reviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">{review.company}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {review.rating}
                      </Typography>
                      <Star color="warning" />
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl">
      {/* En-tête du profil */}
      <StyledCard sx={{ mb: 4, pt: 8, pb: 3, px: 3, textAlign: 'center' }}>
        <LargeAvatar src={client.avatar} alt={client.name} />
        <Typography variant="h4" gutterBottom>
          {client.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={client.status === 'active' ? 'Actif' : 'Inactif'}
            color={client.status === 'active' ? 'success' : 'default'}
          />
        </Box>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email color="action" />
              <Typography>{client.email}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone color="action" />
              <Typography>{client.phone}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="action" />
              <Typography>{client.location}</Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            color="primary"
          >
            Modifier
          </Button>
          <Button
            variant="outlined"
            startIcon={<Block />}
            color="error"
          >
            Bloquer
          </Button>
        </Box>
      </StyledCard>

      {/* Onglets */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<Star sx={{ mr: 1 }} />}
            label="Aperçu"
            iconPosition="start"
          />
          <Tab
            icon={<DirectionsBus sx={{ mr: 1 }} />}
            label="Trajets"
            iconPosition="start"
          />
          <Tab
            icon={<Comment sx={{ mr: 1 }} />}
            label="Avis"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Contenu de l'onglet */}
      <Box sx={{ py: 3 }}>
        {renderTabContent()}
      </Box>
    </Container>
  );
};

export default ClientDetails;
