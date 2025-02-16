import React, { useState } from 'react';
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
  Grid,
  Typography,
  styled,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 600,
  },
}));

interface AddPersonnelDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: number;
}

interface PersonnelFormData {
  type: 'driver' | 'agent';
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  license_number?: string;
  license_expiry_date?: string;
  license_type?: string;
  station_id?: number;
}

const initialFormData: PersonnelFormData = {
  type: 'driver',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  birth_date: '',
  hire_date: dayjs().format('YYYY-MM-DD'),
  status: 'active',
  license_number: '',
  license_expiry_date: '',
  license_type: '',
};

const AddPersonnelDialog: React.FC<AddPersonnelDialogProps> = ({
  open,
  onClose,
  onSuccess,
  companyId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<PersonnelFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof PersonnelFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateChange = (field: 'birth_date' | 'hire_date' | 'license_expiry_date') => (date: dayjs.Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.format('YYYY-MM-DD') : '',
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/companies/${companyId}/personnel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }

      enqueueSnackbar('Personnel ajouté avec succès', { variant: 'success' });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors de la création', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Ajouter un membre du personnel
          <Button
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Type de personnel */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={handleChange('type')}
                  label="Type"
                >
                  <MenuItem value="driver">Chauffeur</MenuItem>
                  <MenuItem value="agent">Agent</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Informations personnelles */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Prénom"
                value={formData.first_name}
                onChange={handleChange('first_name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nom"
                value={formData.last_name}
                onChange={handleChange('last_name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange('address')}
              />
            </Grid>

            {/* Dates */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date de naissance"
                value={formData.birth_date ? dayjs(formData.birth_date) : null}
                onChange={handleDateChange('birth_date')}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date d'embauche"
                value={formData.hire_date ? dayjs(formData.hire_date) : null}
                onChange={handleDateChange('hire_date')}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            {/* Statut */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  label="Statut"
                >
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                  <MenuItem value="on_leave">En congé</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Informations spécifiques au chauffeur */}
            {formData.type === 'driver' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Informations du permis
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Numéro de permis"
                    value={formData.license_number}
                    onChange={handleChange('license_number')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date d'expiration du permis"
                    value={formData.license_expiry_date ? dayjs(formData.license_expiry_date) : null}
                    onChange={handleDateChange('license_expiry_date')}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Type de permis"
                    value={formData.license_type}
                    onChange={handleChange('license_type')}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default AddPersonnelDialog;
