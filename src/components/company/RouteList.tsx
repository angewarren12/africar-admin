import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RouteDialog from './dialogs/RouteDialog';
import DeleteConfirmDialog from '../common/DeleteConfirmDialog';

interface Route {
  id: number;
  departure_station_name: string;
  arrival_station_name: string;
  distance: number;
  duration: number;
  description?: string;
}

const RouteList: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);

  useEffect(() => {
    loadRoutes();
  }, [companyId]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/companies/${companyId}/routes`);
      setRoutes(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des routes:', err);
      setError('Erreur lors du chargement des routes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedRoute(null);
    setDialogOpen(true);
  };

  const handleEditClick = (route: Route) => {
    setSelectedRoute(route);
    setDialogOpen(true);
  };

  const handleDeleteClick = (route: Route) => {
    setRouteToDelete(route);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!routeToDelete) return;

    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/companies/${companyId}/routes/${routeToDelete.id}`);
      await loadRoutes();
      setDeleteDialogOpen(false);
      setRouteToDelete(null);
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la route:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression de la route');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !routes.length) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Routes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Ajouter une route
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Station de départ</TableCell>
                <TableCell>Station d'arrivée</TableCell>
                <TableCell>Distance (km)</TableCell>
                <TableCell>Durée (min)</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.departure_station_name}</TableCell>
                  <TableCell>{route.arrival_station_name}</TableCell>
                  <TableCell>{route.distance}</TableCell>
                  <TableCell>{route.duration}</TableCell>
                  <TableCell>{route.description}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(route)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(route)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {routes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucune route trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <RouteDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={loadRoutes}
          route={selectedRoute || undefined}
          title={selectedRoute ? 'Modifier la route' : 'Ajouter une route'}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Supprimer la route"
          content={`Êtes-vous sûr de vouloir supprimer la route entre ${routeToDelete?.departure_station_name} et ${routeToDelete?.arrival_station_name} ?`}
        />
      </CardContent>
    </Card>
  );
};

export default RouteList;
