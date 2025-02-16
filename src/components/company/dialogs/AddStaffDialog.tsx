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
import { StaffMember, StaffRole } from '../../../types/staff';

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

interface Station {
  id: number;
  name: string;
}

interface AddStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (staffData: Partial<StaffMember>) => void;
  stations: Station[];
}

const AddStaffDialog: React.FC<AddStaffDialogProps> = ({ open, onClose, onSubmit, stations }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('admin');
  const [stationId, setStationId] = useState<number | ''>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Champs spécifiques aux chauffeurs
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);

  // Champs spécifiques aux agents
  const [canProcessPayments, setCanProcessPayments] = useState(false);
  const [canScanTickets, setCanScanTickets] = useState(false);
  const [canValidateManually, setCanValidateManually] = useState(false);

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !phone) {
      return;
    }

    const staffData: Partial<StaffMember> = {
      firstName,
      lastName,
      email,
      phone,
      role,
      stationId: stationId || undefined,
      status: 'active',
      joinDate: new Date().toISOString(),
      address,
      city,
    };

    // Ajouter les champs spécifiques selon le rôle
    if (role === 'driver') {
      staffData.license = {
        number: licenseNumber,
        expiryDate: licenseExpiry,
      };
      staffData.vehicleTypes = vehicleTypes;
    } else if (role === 'cashier' || role === 'ticketController') {
      staffData.canProcessPayments = canProcessPayments;
      staffData.canScanTickets = canScanTickets;
      staffData.canValidateManually = canValidateManually;
    }

    onSubmit(staffData);
    onClose();
  };

  const renderRoleSpecificFields = () => {
    if (role === 'driver') {
      return (
        <>
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
          <Grid item xs={12}>
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
        </>
      );
    }

    if (role === 'cashier' || role === 'ticketController') {
      return (
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Autorisations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={canProcessPayments}
                      onChange={(e) => setCanProcessPayments(e.target.checked)}
                    />
                  }
                  label="Peut gérer la caisse"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={canScanTickets}
                      onChange={(e) => setCanScanTickets(e.target.checked)}
                    />
                  }
                  label="Peut scanner les QR codes"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={canValidateManually}
                      onChange={(e) => setCanValidateManually(e.target.checked)}
                    />
                  }
                  label="Peut valider manuellement les tickets"
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      );
    }

    return null;
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Ajouter un membre du personnel</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box display="flex" justifyContent="center" mb={4}>
          <Person sx={{ fontSize: 64, color: 'primary.main' }} />
        </Box>

        <Grid container spacing={3}>
          {/* Informations de base */}
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
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Grid>

          {/* Rôle et gare */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                label="Rôle"
              >
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="driver">Chauffeur</MenuItem>
                <MenuItem value="cashier">Caissier</MenuItem>
                <MenuItem value="ticketController">Contrôleur de tickets</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {role !== 'admin' && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gare assignée</InputLabel>
                <Select
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value as number)}
                  label="Gare assignée"
                  required
                >
                  {stations.map((station) => (
                    <MenuItem key={station.id} value={station.id}>
                      {station.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

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

          {/* Champs spécifiques au rôle */}
          {renderRoleSpecificFields()}
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
          Ajouter
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddStaffDialog;
