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
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close as CloseIcon, DirectionsBus } from '@mui/icons-material';

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

const VehicleIcon = styled(DirectionsBus)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.primary.main,
}));

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (vehicleData: any) => void;
}

const vehicleTypes = [
  { value: 'bus', label: 'Bus' },
  { value: 'minibus', label: 'Mini-bus' },
  { value: 'van', label: 'Van' },
];

const vehicleBrands = [
  { value: 'toyota', label: 'Toyota' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'volkswagen', label: 'Volkswagen' },
  { value: 'hyundai', label: 'Hyundai' },
  { value: 'ford', label: 'Ford' },
];

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({ open, onClose, onSubmit }) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [capacity, setCapacity] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('diesel');
  const [hasAC, setHasAC] = useState(true);
  const [hasWifi, setHasWifi] = useState(true);
  const [hasUSB, setHasUSB] = useState(true);
  const [hasToilet, setHasToilet] = useState(false);
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');

  const handleSubmit = () => {
    if (!registrationNumber || !brand || !model || !type || !capacity) {
      return;
    }

    const vehicleData = {
      registrationNumber,
      brand,
      model,
      type,
      year: parseInt(year),
      capacity: parseInt(capacity),
      mileage: parseInt(mileage),
      fuelType,
      features: {
        ac: hasAC,
        wifi: hasWifi,
        usb: hasUSB,
        toilet: hasToilet,
      },
      maintenance: {
        nextDate: nextMaintenanceDate,
        lastDate: new Date().toISOString().split('T')[0],
        status: 'ok',
      },
      insurance: {
        expiryDate: insuranceExpiryDate,
        status: 'valid',
      },
      status: 'available',
    };

    onSubmit(vehicleData);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Ajouter un nouveau véhicule</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box display="flex" justifyContent="center" mb={4}>
          <VehicleIcon />
        </Box>

        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Numéro d'immatriculation"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Type de véhicule</InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)} label="Type de véhicule">
                {vehicleTypes.map((vType) => (
                  <MenuItem key={vType.value} value={vType.value}>
                    {vType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Marque</InputLabel>
              <Select value={brand} onChange={(e) => setBrand(e.target.value)} label="Marque">
                {vehicleBrands.map((vBrand) => (
                  <MenuItem key={vBrand.value} value={vBrand.value}>
                    {vBrand.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Modèle"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Année"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              inputProps={{ min: 2000, max: new Date().getFullYear() }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Capacité (passagers)"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Kilométrage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </Grid>

          {/* Type de carburant */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Type de carburant</InputLabel>
              <Select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                label="Type de carburant"
              >
                <MenuItem value="diesel">Diesel</MenuItem>
                <MenuItem value="gasoline">Essence</MenuItem>
                <MenuItem value="hybrid">Hybride</MenuItem>
                <MenuItem value="electric">Électrique</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Dates importantes */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Prochaine maintenance"
              type="date"
              value={nextMaintenanceDate}
              onChange={(e) => setNextMaintenanceDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Expiration assurance"
              type="date"
              value={insuranceExpiryDate}
              onChange={(e) => setInsuranceExpiryDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Équipements */}
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
                flexWrap: 'wrap',
                gap: 3,
              }}
            >
              <FormControlLabel
                control={<Switch checked={hasAC} onChange={(e) => setHasAC(e.target.checked)} />}
                label="Climatisation"
              />
              <FormControlLabel
                control={<Switch checked={hasWifi} onChange={(e) => setHasWifi(e.target.checked)} />}
                label="Wi-Fi"
              />
              <FormControlLabel
                control={<Switch checked={hasUSB} onChange={(e) => setHasUSB(e.target.checked)} />}
                label="Ports USB"
              />
              <FormControlLabel
                control={
                  <Switch checked={hasToilet} onChange={(e) => setHasToilet(e.target.checked)} />
                }
                label="Toilettes"
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
          Ajouter le véhicule
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddVehicleDialog;
