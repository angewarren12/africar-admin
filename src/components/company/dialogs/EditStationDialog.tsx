import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  styled,
  alpha,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close as CloseIcon, LocationOn } from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(
      theme.palette.background.paper,
      0.98
    )} 100%)`,
    backdropFilter: 'blur(10px)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
    theme.palette.primary.main,
    0.1
  )} 100%)`,
  padding: theme.spacing(2),
}));

const LocationIcon = styled(LocationOn)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.primary.main,
}));

interface Station {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  location: {
    latitude: number;
    longitude: number;
  };
  isMainStation: boolean;
  facilities: {
    waitingRoom: boolean;
    ticketOffice: boolean;
    parking: boolean;
  };
  status: 'active' | 'inactive' | 'maintenance';
}

interface EditStationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (stationData: any) => void;
  station: Station;
}

const EditStationDialog: React.FC<EditStationDialogProps> = ({
  open,
  onClose,
  onSubmit,
  station,
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [capacity, setCapacity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isMainStation, setIsMainStation] = useState(false);
  const [hasWaitingRoom, setHasWaitingRoom] = useState(true);
  const [hasTicketOffice, setHasTicketOffice] = useState(true);
  const [hasParking, setHasParking] = useState(true);
  const [status, setStatus] = useState<Station['status']>('active');

  useEffect(() => {
    // Initialiser les champs avec les données de la station
    setName(station.name);
    setCity(station.city);
    setAddress(station.address);
    setPhone(station.phone);
    setEmail(station.email);
    setCapacity(station.capacity.toString());
    setLatitude(station.location.latitude.toString());
    setLongitude(station.location.longitude.toString());
    setIsMainStation(station.isMainStation);
    setHasWaitingRoom(station.facilities.waitingRoom);
    setHasTicketOffice(station.facilities.ticketOffice);
    setHasParking(station.facilities.parking);
    setStatus(station.status);
  }, [station]);

  const handleSubmit = () => {
    if (!name || !city || !address) {
      return;
    }

    const updatedStation = {
      ...station,
      name,
      city,
      address,
      phone,
      email,
      capacity: parseInt(capacity),
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      isMainStation,
      facilities: {
        waitingRoom: hasWaitingRoom,
        ticketOffice: hasTicketOffice,
        parking: hasParking,
      },
      status,
    };

    onSubmit(updatedStation);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Modifier la gare</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box display="flex" justifyContent="center" mb={4}>
          <LocationIcon />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom de la gare"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Capacité (nombre de bus)"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isMainStation}
                    onChange={(e) => setIsMainStation(e.target.checked)}
                  />
                }
                label="Gare principale"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              inputProps={{ step: 'any' }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              inputProps={{ step: 'any' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Équipements
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                display: 'flex',
                gap: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={hasWaitingRoom}
                    onChange={(e) => setHasWaitingRoom(e.target.checked)}
                  />
                }
                label="Salle d'attente"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={hasTicketOffice}
                    onChange={(e) => setHasTicketOffice(e.target.checked)}
                  />
                }
                label="Guichet"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={hasParking}
                    onChange={(e) => setHasParking(e.target.checked)}
                  />
                }
                label="Parking"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          }}
        >
          Mettre à jour
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditStationDialog;
