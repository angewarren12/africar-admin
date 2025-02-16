import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { API_BASE_URL } from '../../../config/api';

interface Station {
  id: number;
  name: string;
  city: string;
}

interface TripStop {
  id: number;
  station_id: number;
  arrival_time: string;
  departure_time: string;
  stop_order: number;
  price: number;
  available_seats: number;
  boarding_count: number;
  alighting_count: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  platform: string;
  notes: string;
}

interface EditTripStopDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: (updatedStop: Partial<TripStop>) => Promise<void>;
  stop: TripStop;
  companyId: number;
}

const EditTripStopDialog: React.FC<EditTripStopDialogProps> = ({
  open,
  onClose,
  onEdit,
  stop,
  companyId,
}) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TripStop>>({
    station_id: stop.station_id,
    arrival_time: stop.arrival_time,
    departure_time: stop.departure_time,
    stop_order: stop.stop_order,
    price: stop.price,
    available_seats: stop.available_seats,
    boarding_count: stop.boarding_count,
    alighting_count: stop.alighting_count,
    status: stop.status,
    platform: stop.platform,
    notes: stop.notes,
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/companies/${companyId}/stations`
        );
        if (!response.ok) throw new Error('Erreur lors de la récupération des stations');
        const data = await response.json();
        setStations(data);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les stations');
      }
    };

    if (open) {
      fetchStations();
    }
  }, [open, companyId]);

  useEffect(() => {
    setFormData({
      station_id: stop.station_id,
      arrival_time: stop.arrival_time,
      departure_time: stop.departure_time,
      stop_order: stop.stop_order,
      price: stop.price,
      available_seats: stop.available_seats,
      boarding_count: stop.boarding_count,
      alighting_count: stop.alighting_count,
      status: stop.status,
      platform: stop.platform,
      notes: stop.notes,
    });
  }, [stop]);

  const handleChange = (field: string) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateChange = (field: string) => (value: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onEdit(formData);
      handleClose();
    } catch (err) {
      setError('Erreur lors de la modification de l\'arrêt');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Modifier l'arrêt</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <FormControl fullWidth>
              <InputLabel>Station</InputLabel>
              <Select
                value={formData.station_id}
                onChange={handleChange('station_id')}
                label="Station"
                required
              >
                {stations.map((station) => (
                  <MenuItem key={station.id} value={station.id}>
                    {station.name} ({station.city})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" gap={2}>
              <DateTimePicker
                label="Heure d'arrivée"
                value={formData.arrival_time}
                onChange={handleDateChange('arrival_time')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />

              <DateTimePicker
                label="Heure de départ"
                value={formData.departure_time}
                onChange={handleDateChange('departure_time')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Ordre d'arrêt"
                type="number"
                value={formData.stop_order}
                onChange={handleChange('stop_order')}
                required
              />

              <TextField
                fullWidth
                label="Places disponibles"
                type="number"
                value={formData.available_seats}
                onChange={handleChange('available_seats')}
              />
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Montées"
                type="number"
                value={formData.boarding_count}
                onChange={handleChange('boarding_count')}
              />

              <TextField
                fullWidth
                label="Descentes"
                type="number"
                value={formData.alighting_count}
                onChange={handleChange('alighting_count')}
              />
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Prix"
                type="number"
                value={formData.price}
                onChange={handleChange('price')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">€</InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Quai"
                value={formData.platform}
                onChange={handleChange('platform')}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={formData.status}
                onChange={handleChange('status')}
                label="Statut"
                required
              >
                <MenuItem value="scheduled">Prévu</MenuItem>
                <MenuItem value="completed">Complété</MenuItem>
                <MenuItem value="cancelled">Annulé</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTripStopDialog;
