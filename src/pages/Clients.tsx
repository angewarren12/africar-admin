import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  styled,
  alpha,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  Download,
  Print,
  Refresh,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
  totalTrips: number;
  status: 'active' | 'inactive';
  lastTrip: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jean Kouassi',
    email: 'jean.kouassi@email.com',
    phone: '+225 0123456789',
    location: 'Abidjan, Côte d\'Ivoire',
    joinDate: '2024-01-15',
    avatar: '/avatars/1.jpg',
    totalTrips: 12,
    status: 'active',
    lastTrip: '2024-02-01',
  },
  // Ajoutez plus de clients ici
];

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients] = useState<Client[]>(mockClients);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Clients
        </Typography>
        <Typography color="text.secondary">
          {filteredClients.length} clients inscrits sur l'application
        </Typography>
      </Box>

      {/* Barre d'outils */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleMenuOpen}
          >
            Filtres
          </Button>
          <Tooltip title="Rafraîchir">
            <IconButton>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exporter">
            <IconButton>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimer">
            <IconButton>
              <Print />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Liste des clients */}
      <Grid container spacing={3}>
        {filteredClients.map((client) => (
          <Grid item xs={12} md={6} lg={4} key={client.id}>
            <StyledCard 
              onClick={() => navigate(`/clients/${client.id}`)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ p: 3 }}>
                {/* En-tête de la carte */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StyledAvatar src={client.avatar} alt={client.name} />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {client.name}
                    </Typography>
                    <Chip
                      label={client.status === 'active' ? 'Actif' : 'Inactif'}
                      color={client.status === 'active' ? 'success' : 'default'}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Informations du client */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{client.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{client.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{client.location}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Statistiques */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Trajets
                    </Typography>
                    <Typography variant="h6">
                      {client.totalTrips}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Dernier Trajet
                    </Typography>
                    <Typography variant="body2">
                      {new Date(client.lastTrip).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Date d'inscription */}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Inscrit le {new Date(client.joinDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Menu des filtres */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={() => setSelectedStatus('all')}>
          Tous les clients
        </MenuItem>
        <MenuItem onClick={() => setSelectedStatus('active')}>
          Clients actifs
        </MenuItem>
        <MenuItem onClick={() => setSelectedStatus('inactive')}>
          Clients inactifs
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={() => setSelectedStatus('recent')}>
          Inscrits récemment
        </MenuItem>
        <MenuItem onClick={() => setSelectedStatus('frequent')}>
          Clients fréquents
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Clients;
