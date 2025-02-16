import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
  Avatar,
  styled,
  alpha,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Wc as GenderIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { API_BASE_URL } from '../../config/api';
import { useSnackbar } from 'notistack';

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  '&.MuiChip-colorSuccess': {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.dark,
  },
  '&.MuiChip-colorWarning': {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.dark,
  },
  '&.MuiChip-colorError': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.dark,
  },
}));

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
  date_of_birth: string | null;
  gender: 'M' | 'F' | 'other' | null;
  address: string | null;
  city: string;
  country: string;
  id_card_number: string | null;
  id_card_type: 'CNI' | 'Passport' | 'Autre' | null;
  account_status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  phone_verified: boolean;
  last_login: string;
  created_at: string;
}

interface CustomerDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer;
  onUpdate: () => void;
}

const CustomerDetailsDialog: React.FC<CustomerDetailsDialogProps> = ({
  open,
  onClose,
  customer,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    first_name: customer.first_name,
    last_name: customer.last_name,
    date_of_birth: customer.date_of_birth,
    gender: customer.gender,
    address: customer.address,
    city: customer.city,
    country: customer.country,
    id_card_number: customer.id_card_number,
    id_card_type: customer.id_card_type,
  });

  const handleChange = (field: string) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/customers/${customer.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      enqueueSnackbar('Client mis à jour avec succès', { variant: 'success' });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Erreur lors de la mise à jour', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (
    status: string
  ): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'suspended':
        return 'Suspendu';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Détails du client</Typography>
          <Box>
            {!isEditing && (
              <Button
                variant="contained"
                onClick={() => setIsEditing(true)}
                sx={{ mr: 2 }}
              >
                Modifier
              </Button>
            )}
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* En-tête du profil */}
          <Box
            display="flex"
            alignItems="center"
            gap={3}
            mb={3}
            p={2}
            sx={{
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
            }}
          >
            <Avatar
              src={customer.profile_photo || undefined}
              sx={{ width: 80, height: 80 }}
            />
            <Box flex={1}>
              <Typography variant="h5" gutterBottom>
                {customer.first_name} {customer.last_name}
              </Typography>
              <Box display="flex" gap={2}>
                <StyledChip
                  label={getStatusLabel(customer.account_status)}
                  color={getStatusColor(customer.account_status)}
                />
                <Chip
                  label={customer.email_verified ? 'Email vérifié' : 'Email non vérifié'}
                  color={customer.email_verified ? 'success' : 'error'}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={customer.phone_verified ? 'Téléphone vérifié' : 'Téléphone non vérifié'}
                  color={customer.phone_verified ? 'success' : 'error'}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {isEditing ? (
            /* Formulaire d'édition */
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  value={formData.first_name}
                  onChange={handleChange('first_name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={formData.last_name}
                  onChange={handleChange('last_name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date de naissance"
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={handleChange('date_of_birth')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={formData.gender || ''}
                    onChange={handleChange('gender')}
                    label="Genre"
                  >
                    <MenuItem value="M">Homme</MenuItem>
                    <MenuItem value="F">Femme</MenuItem>
                    <MenuItem value="other">Autre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  value={formData.address || ''}
                  onChange={handleChange('address')}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ville"
                  value={formData.city}
                  onChange={handleChange('city')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pays"
                  value={formData.country}
                  onChange={handleChange('country')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Numéro de pièce d'identité"
                  value={formData.id_card_number || ''}
                  onChange={handleChange('id_card_number')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de pièce</InputLabel>
                  <Select
                    value={formData.id_card_type || ''}
                    onChange={handleChange('id_card_type')}
                    label="Type de pièce"
                  >
                    <MenuItem value="CNI">CNI</MenuItem>
                    <MenuItem value="Passport">Passeport</MenuItem>
                    <MenuItem value="Autre">Autre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button onClick={() => setIsEditing(false)}>Annuler</Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Enregistrer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ) : (
            /* Affichage des informations */
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Informations personnelles
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography>{customer.email}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PhoneIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Téléphone
                      </Typography>
                      <Typography>{customer.phone}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date de naissance
                      </Typography>
                      <Typography>
                        {customer.date_of_birth
                          ? format(new Date(customer.date_of_birth), 'dd MMMM yyyy', {
                              locale: fr,
                            })
                          : 'Non renseignée'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <GenderIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Genre
                      </Typography>
                      <Typography>
                        {customer.gender === 'M'
                          ? 'Homme'
                          : customer.gender === 'F'
                          ? 'Femme'
                          : customer.gender === 'other'
                          ? 'Autre'
                          : 'Non renseigné'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Adresse et documents
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Adresse
                      </Typography>
                      <Typography>
                        {customer.address || 'Non renseignée'}
                      </Typography>
                      <Typography>
                        {customer.city}, {customer.country}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CreditCardIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pièce d'identité
                      </Typography>
                      <Typography>
                        {customer.id_card_type
                          ? `${customer.id_card_type} - ${customer.id_card_number}`
                          : 'Non renseignée'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom color="primary">
                  Informations du compte
                </Typography>
                <Box display="flex" gap={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Date d'inscription
                    </Typography>
                    <Typography>
                      {format(new Date(customer.created_at), 'dd MMMM yyyy', {
                        locale: fr,
                      })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Dernière connexion
                    </Typography>
                    <Typography>
                      {customer.last_login
                        ? format(new Date(customer.last_login), 'dd/MM/yyyy HH:mm', {
                            locale: fr,
                          })
                        : 'Jamais connecté'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
