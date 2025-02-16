import React, { useState, useEffect } from 'react';
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
import { API_BASE_URL } from '../../../config/api';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 600,
  },
}));

interface Personnel {
  id: number;
  company_id: number;
  type: 'driver' | 'agent';
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  license_number?: string;
  license_expiry_date?: string;
  license_type?: string;
  role?: string;
  station_id?: number;
  created_at: string;
  updated_at: string;
}

interface EditPersonnelDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  personnel: Personnel;
  companyId: number;
}

const EditPersonnelDialog: React.FC<EditPersonnelDialogProps> = ({
  open,
  onClose,
  onSuccess,
  personnel,
  companyId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<Partial<Personnel>>({
    type: 'driver',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (personnel) {
      setFormData({
        type: personnel.type || 'driver',
        first_name: personnel.first_name,
        last_name: personnel.last_name,
        email: personnel.email,
        phone: personnel.phone || '',
        address: personnel.address || '',
        birth_date: personnel.birth_date || '',
        hire_date: personnel.hire_date,
        status: personnel.status || 'active',
        license_number: personnel.license_number || '',
        license_expiry_date: personnel.license_expiry_date || '',
        license_type: personnel.license_type || '',
        role: personnel.role || '',
        station_id: personnel.station_id,
      });
    }
  }, [personnel]);

  const handleChange = (field: keyof Personnel) => (
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
      const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/personnel/${personnel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }

      enqueueSnackbar('Personnel modifié avec succès', { variant: 'success' });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors de la modification', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: 'driver',
      status: 'active',
    });
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Modifier le personnel
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
                  value={formData.type || 'driver'}
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
                value={formData.first_name || ''}
                onChange={handleChange('first_name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nom"
                value={formData.last_name || ''}
                onChange={handleChange('last_name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange('email')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                type="password"
                value={formData.password || ''}
                onChange={handleChange('password')}
                placeholder="Laisser vide pour ne pas changer"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone || ''}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                multiline
                rows={2}
                value={formData.address || ''}
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
                  value={formData.status || 'active'}
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
                    value={formData.license_number || ''}
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
                    value={formData.license_type || ''}
                    onChange={handleChange('license_type')}
                  />
                </Grid>
              </>
            )}

            {/* Rôle */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rôle"
                value={formData.role || ''}
                onChange={handleChange('role')}
              />
            </Grid>
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
            {loading ? 'Modification...' : 'Modifier'}
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default EditPersonnelDialog;
