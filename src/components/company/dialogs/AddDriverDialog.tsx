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
import { Close as CloseIcon, Person } from '@mui/icons-material';

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

const DriverIcon = styled(Person)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.primary.main,
}));

interface AddDriverDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (driverData: any) => void;
}

const AddDriverDialog: React.FC<AddDriverDialogProps> = ({ open, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [isFullTime, setIsFullTime] = useState(true);
  const [hasFirstAidCert, setHasFirstAidCert] = useState(false);
  const [hasSafetyCert, setHasSafetyCert] = useState(false);

  const handleSubmit = () => {
    if (!firstName || !lastName || !licenseNumber || !licenseExpiry) {
      return;
    }

    const driverData = {
      firstName,
      lastName,
      email,
      phone,
      license: {
        number: licenseNumber,
        expiryDate: licenseExpiry,
      },
      birthDate,
      address,
      city,
      experience: parseInt(experience),
      vehicleTypes,
      employmentType: isFullTime ? 'fullTime' : 'partTime',
      certifications: {
        firstAid: hasFirstAidCert,
        safety: hasSafetyCert,
      },
      status: 'available',
      rating: 5,
      totalTrips: 0,
      totalHours: 0,
    };

    onSubmit(driverData);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Ajouter un nouveau chauffeur</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box display="flex" justifyContent="center" mb={4}>
          <DriverIcon />
        </Box>

        <Grid container spacing={3}>
          {/* Informations personnelles */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
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
              label="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date de naissance"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Années d'expérience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Adresse */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Grid>

          {/* Informations de permis */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Numéro de permis"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date d'expiration du permis"
              type="date"
              value={licenseExpiry}
              onChange={(e) => setLicenseExpiry(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Types de véhicules */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Types de véhicules</InputLabel>
              <Select
                multiple
                value={vehicleTypes}
                onChange={(e) => setVehicleTypes(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                label="Types de véhicules"
              >
                <MenuItem value="bus">Bus</MenuItem>
                <MenuItem value="minibus">Mini-bus</MenuItem>
                <MenuItem value="van">Van</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Options supplémentaires */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Options supplémentaires
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch checked={isFullTime} onChange={(e) => setIsFullTime(e.target.checked)} />
                    }
                    label="Temps plein"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hasFirstAidCert}
                        onChange={(e) => setHasFirstAidCert(e.target.checked)}
                      />
                    }
                    label="Certificat premiers secours"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hasSafetyCert}
                        onChange={(e) => setHasSafetyCert(e.target.checked)}
                      />
                    }
                    label="Certificat sécurité"
                  />
                </Grid>
              </Grid>
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
          Ajouter le chauffeur
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddDriverDialog;
