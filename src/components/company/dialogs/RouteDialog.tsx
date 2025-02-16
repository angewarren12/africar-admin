import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Station {
  id: number;
  name: string;
}

interface Route {
  id?: number;
  departure_station_id: number;
  arrival_station_id: number;
  distance: number;
  duration: number;
  base_price: number;
}

interface RouteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  route?: Route;
  title: string;
}

const RouteDialog: React.FC<RouteDialogProps> = ({
  open,
  onClose,
  onSave,
  route,
  title
}) => {
  const { id: companyId } = useParams<{ id: string }>();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Route>({
    departure_station_id: 0,
    arrival_station_id: 0,
    distance: 0,
    duration: 0,
    base_price: 0
  });

  useEffect(() => {
    if (open) {
      loadStations();
      if (route) {
        setFormData(route);
      } else {
        setFormData({
          departure_station_id: 0,
          arrival_station_id: 0,
          distance: 0,
          duration: 0,
          base_price: 0
        });
      }
    }
  }, [open, route]);

  const loadStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/companies/${companyId}/stations`);
      setStations(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des stations:', err);
      setError('Erreur lors du chargement des stations');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Route) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (route?.id) {
        await axios.put(
          `/api/companies/${companyId}/routes/${route.id}`,
          formData
        );
      } else {
        await axios.post(`/api/companies/${companyId}/routes`, formData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Erreur lors de l\'enregistrement de la route:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement de la route');
    } finally {
      setLoading(false);
    }
  };

  const isValid = () => {
    return (
      formData.departure_station_id > 0 &&
      formData.arrival_station_id > 0 &&
      formData.departure_station_id !== formData.arrival_station_id &&
      formData.distance > 0 &&
      formData.duration > 0 &&
      formData.base_price > 0
    );
  };

  if (loading && !stations.length) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Station de départ</InputLabel>
            <Select
              value={formData.departure_station_id}
              onChange={handleChange('departure_station_id')}
              label="Station de départ"
            >
              <MenuItem value={0}>Sélectionner une station</MenuItem>
              {stations.map((station) => (
                <MenuItem
                  key={station.id}
                  value={station.id}
                  disabled={station.id === formData.arrival_station_id}
                >
                  {station.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Station d'arrivée</InputLabel>
            <Select
              value={formData.arrival_station_id}
              onChange={handleChange('arrival_station_id')}
              label="Station d'arrivée"
            >
              <MenuItem value={0}>Sélectionner une station</MenuItem>
              {stations.map((station) => (
                <MenuItem
                  key={station.id}
                  value={station.id}
                  disabled={station.id === formData.departure_station_id}
                >
                  {station.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Distance"
            type="number"
            value={formData.distance}
            onChange={handleChange('distance')}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">km</InputAdornment>
            }}
          />

          <TextField
            fullWidth
            label="Durée"
            type="number"
            value={formData.duration}
            onChange={handleChange('duration')}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>
            }}
          />

          <TextField
            fullWidth
            label="Prix de base"
            type="number"
            value={formData.base_price}
            onChange={handleChange('base_price')}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">FCFA</InputAdornment>
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid() || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RouteDialog;
