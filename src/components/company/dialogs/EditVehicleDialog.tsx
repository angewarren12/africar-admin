import React, { useState } from 'react';
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
  Button,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

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

interface Vehicle {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  capacity: number;
  manufactureYear: number;
  features: {
    hasAC: boolean;
    hasWifi: boolean;
    hasToilet: boolean;
    hasTv: boolean;
  };
  status: 'active' | 'inactive' | 'under_maintenance';
  statistics?: {
    completedTrips: number;
    activeTrips: number;
  };
  created_at: string;
  updated_at: string;
}

interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onEdit: (updatedVehicle: Partial<Vehicle>) => void;
}

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
  open,
  onClose,
  vehicle,
  onEdit,
}) => {
  const [formData, setFormData] = useState({
    registrationNumber: vehicle.registrationNumber,
    brand: vehicle.brand,
    model: vehicle.model,
    type: vehicle.type,
    capacity: vehicle.capacity,
    manufactureYear: vehicle.manufactureYear,
    features: {
      hasAC: vehicle.features.hasAC,
      hasWifi: vehicle.features.hasWifi,
      hasToilet: vehicle.features.hasToilet,
      hasTv: vehicle.features.hasTv,
    },
    status: vehicle.status,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (feature: keyof Vehicle['features']) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(formData);
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 3, background: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
        <Typography variant="h6">Modifier le véhicule</Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Informations de base */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Numéro d'immatriculation"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Marque"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Modèle"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <MenuItem value="bus">Bus</MenuItem>
                <MenuItem value="minibus">Minibus</MenuItem>
                <MenuItem value="van">Van</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Capacité"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Année de fabrication"
                name="manufactureYear"
                value={formData.manufactureYear}
                onChange={handleChange}
              />
            </Grid>

            {/* Statut */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Statut"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="inactive">Inactif</MenuItem>
                <MenuItem value="under_maintenance">En maintenance</MenuItem>
              </TextField>
            </Grid>

            {/* Équipements */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Équipements
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.features.hasAC}
                      onChange={() => handleFeatureChange('hasAC')}
                    />
                  }
                  label="Climatisation"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.features.hasWifi}
                      onChange={() => handleFeatureChange('hasWifi')}
                    />
                  }
                  label="Wi-Fi"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.features.hasToilet}
                      onChange={() => handleFeatureChange('hasToilet')}
                    />
                  }
                  label="Toilettes"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.features.hasTv}
                      onChange={() => handleFeatureChange('hasTv')}
                    />
                  }
                  label="TV"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default EditVehicleDialog;
