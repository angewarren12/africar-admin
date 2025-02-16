import React from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  styled,
  alpha,
  Button,
  Chip,
} from '@mui/material';
import {
  Business,
  Phone,
  Email,
  LocationOn,
  DirectionsBus,
  Person,
  Route,
  Edit as EditIcon,
  Language,
  Assignment,
  Receipt,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
    theme.palette.primary.main,
    0.05
  )} 100%)`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 20px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

interface CompanyInfoProps {
  company: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    description?: string;
    logoUrl?: string;
    registrationNumber?: string;
    taxNumber?: string;
    website?: string;
    foundingDate?: string;
    licenseExpiryDate?: string;
    status: 'active' | 'inactive';
    fleetSize: number;
    driversCount: number;
    routesCount: number;
    stationsCount: number;
    createdAt: string;
    updatedAt: string;
  };
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ company }) => {
  return (
    <Box>
      {/* En-tête de la compagnie */}
      <StyledCard sx={{ mb: 4 }}>
        <Box p={3}>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {company.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {company.description || 'Description non disponible'}
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                {company.registrationNumber && (
                  <Chip
                    label={`N° RC: ${company.registrationNumber}`}
                    size="small"
                    color="primary"
                  />
                )}
                {company.foundingDate && (
                  <Chip
                    label={`Depuis ${format(new Date(company.foundingDate), 'MMMM yyyy', { locale: fr })}`}
                    size="small"
                    color="default"
                  />
                )}
                <Chip
                  label={company.status === 'active' ? 'Actif' : 'Inactif'}
                  size="small"
                  color={company.status === 'active' ? 'success' : 'error'}
                />
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              size="small"
            >
              Modifier
            </Button>
          </Box>

          {/* Informations de contact */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" gap={1} alignItems="center">
                  <Email color="action" />
                  <Typography>{company.email}</Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <Phone color="action" />
                  <Typography>{company.phone}</Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <LocationOn color="action" />
                  <Typography>{company.address}</Typography>
                </Box>
                {company.website && (
                  <Box display="flex" gap={1} alignItems="center">
                    <Language color="action" />
                    <Typography>{company.website}</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap={1}>
                {company.registrationNumber && (
                  <Box display="flex" gap={1} alignItems="center">
                    <Assignment color="action" />
                    <Typography>N° RC: {company.registrationNumber}</Typography>
                  </Box>
                )}
                {company.taxNumber && (
                  <Box display="flex" gap={1} alignItems="center">
                    <Receipt color="action" />
                    <Typography>N° CC: {company.taxNumber}</Typography>
                  </Box>
                )}
                {company.licenseExpiryDate && (
                  <Box display="flex" gap={1} alignItems="center">
                    <Business color="action" />
                    <Typography>
                      Licence valide jusqu'au {format(new Date(company.licenseExpiryDate), 'dd MMMM yyyy', { locale: fr })}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </StyledCard>

      {/* Statistiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <DirectionsBus sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" color="primary">
                {company.fleetSize}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Véhicules
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Person sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" color="primary">
                {company.driversCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chauffeurs
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Route sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" color="primary">
                {company.routesCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trajets
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" color="primary">
                {company.stationsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gares
              </Typography>
            </Box>
          </StatCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyInfo;
