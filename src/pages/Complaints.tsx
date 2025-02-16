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
  Stack,
  Button,
} from '@mui/material';
import {
  Search,
  CheckCircle,
  Message,
  Delete,
  Warning,
} from '@mui/icons-material';
import { Complaint } from '../types';

// Données simulées pour le développement
const mockComplaints: Complaint[] = [
  {
    id: '1',
    type: 'delay',
    status: 'pending',
    priority: 'high',
    subject: 'Retard important',
    description: 'Le car a plus de 2 heures de retard sans explication',
    userId: 'user123',
    tripId: 'trip456',
    stationId: 'station789',
    createdAt: '2024-02-06T10:30:00',
  },
  // Ajoutez plus de plaintes simulées ici
];

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [complaints] = useState<Complaint[]>(mockComplaints);

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: Complaint['type']) => {
    switch (type) {
      case 'delay':
        return 'Retard';
      case 'refund':
        return 'Remboursement';
      case 'driver':
        return 'Chauffeur';
      case 'station':
        return 'Gare';
      case 'other':
        return 'Autre';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: Complaint['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in_progress':
        return 'En traitement';
      case 'resolved':
        return 'Résolu';
      default:
        return status;
    }
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Gestion des Réclamations
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<Warning />}
            sx={{ mr: 1 }}
          >
            Haute Priorité ({complaints.filter(c => c.priority === 'high').length})
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<Warning />}
          >
            Moyenne Priorité ({complaints.filter(c => c.priority === 'medium').length})
          </Button>
        </Box>
      </Stack>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher une réclamation..."
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
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Sujet</TableCell>
                <TableCell>Priorité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTypeLabel(complaint.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {complaint.subject}
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
                      {complaint.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.priority}
                      color={getPriorityColor(complaint.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(complaint.status)}
                      color={getStatusColor(complaint.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        // Implémenter la logique de réponse
                      }}
                    >
                      <Message />
                    </IconButton>
                    {complaint.status !== 'resolved' && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => {
                          // Implémenter la logique de résolution
                        }}
                      >
                        <CheckCircle />
                      </IconButton>
                    )}
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

export default Complaints;
