import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  LocalOffer,
  Pause,
  PlayArrow,
} from '@mui/icons-material';
import { Promotion } from '../types';

// Données simulées pour le développement
const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Offre de Lancement',
    description: '20% de réduction sur tous les trajets',
    discountType: 'percentage',
    discountValue: 20,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    applicableStations: ['all'],
    minimumAmount: 5000,
    maxDiscount: 10000,
    usageLimit: 1000,
    usageCount: 150,
    status: 'active',
  },
  // Ajoutez plus de promotions simulées ici
];

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotions] = useState<Promotion[]>(mockPromotions);

  const getStatusColor = (status: Promotion['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Promotion['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'scheduled':
        return 'Planifiée';
      case 'expired':
        return 'Expirée';
      default:
        return status;
    }
  };

  const filteredPromotions = promotions.filter(
    (promotion) =>
      promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Gestion des Promotions
        </Typography>
        <Button
          variant="contained"
          startIcon={<LocalOffer />}
          onClick={() => {
            // Implémenter la logique d'ajout de promotion
          }}
        >
          Nouvelle Promotion
        </Button>
      </Stack>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher une promotion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Promotion</TableCell>
                <TableCell>Réduction</TableCell>
                <TableCell>Période</TableCell>
                <TableCell>Utilisation</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {promotion.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {promotion.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {promotion.discountType === 'percentage'
                        ? `${promotion.discountValue}%`
                        : `${promotion.discountValue.toLocaleString()} FCFA`}
                    </Typography>
                    {promotion.maxDiscount && (
                      <Typography variant="body2" color="textSecondary">
                        Max: {promotion.maxDiscount.toLocaleString()} FCFA
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Du {new Date(promotion.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Au {new Date(promotion.endDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {promotion.usageCount}/{promotion.usageLimit || '∞'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(promotion.status)}
                      color={getStatusColor(promotion.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {promotion.status === 'active' ? (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => {
                          // Implémenter la logique de pause
                        }}
                      >
                        <Pause />
                      </IconButton>
                    ) : promotion.status === 'scheduled' ? (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => {
                          // Implémenter la logique d'activation
                        }}
                      >
                        <PlayArrow />
                      </IconButton>
                    ) : null}
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        // Implémenter la logique d'édition
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        // Implémenter la logique de suppression
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Promotions;
