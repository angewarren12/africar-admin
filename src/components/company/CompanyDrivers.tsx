import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  styled,
  alpha,
  Button,
  IconButton,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Person,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Phone,
  Email,
  DriveEta,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const DriverCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
    theme.palette.background.paper,
    0.95
  )} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

interface Driver {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  license_expiry: string;
  status: 'active' | 'inactive' | 'suspended';
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

interface CompanyDriversProps {
  drivers: Driver[];
  companyId: number;
}

const statusColors: Record<string, 'success' | 'error' | 'warning'> = {
  active: 'success',
  inactive: 'error',
  suspended: 'warning',
};

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle fontSize="small" color="success" />,
  inactive: <ErrorIcon fontSize="small" color="error" />,
  suspended: <ScheduleIcon fontSize="small" color="warning" />,
};

const statusLabels: Record<string, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  suspended: 'Suspendu',
};

const CompanyDrivers: React.FC<CompanyDriversProps> = ({ drivers, companyId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    license_number: '',
    license_expiry: '',
    status: 'active',
    photo_url: '',
  });

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      first_name: driver.first_name,
      last_name: driver.last_name,
      email: driver.email,
      phone: driver.phone,
      license_number: driver.license_number,
      license_expiry: driver.license_expiry.split('T')[0],
      status: driver.status,
      photo_url: driver.photo_url || '',
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingDriver(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      license_number: '',
      license_expiry: '',
      status: 'active',
      photo_url: '',
    });
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    // Implémenter la logique de sauvegarde
    setOpenDialog(false);
  };

  const handleDelete = (driverId: number) => {
    // Implémenter la logique de suppression
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Chauffeurs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Ajouter un chauffeur
        </Button>
      </Box>

      {drivers.length === 0 ? (
        <StyledCard>
          <Box p={3} textAlign="center">
            <Typography color="text.secondary">
              Aucun chauffeur n'a été ajouté pour cette compagnie.
            </Typography>
          </Box>
        </StyledCard>
      ) : (
        <Grid container spacing={3}>
          {drivers.map((driver) => (
            <Grid item xs={12} sm={6} md={4} key={driver.id}>
              <DriverCard>
                <Box p={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box display="flex" gap={2}>
                      <Avatar
                        src={driver.photo_url}
                        alt={`${driver.first_name} ${driver.last_name}`}
                        sx={{ width: 56, height: 56 }}
                      >
                        {driver.first_name[0]}
                        {driver.last_name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {driver.first_name} {driver.last_name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <DriveEta fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {driver.license_number}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(driver)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(driver.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box mt={2} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">{driver.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{driver.phone}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip
                        icon={statusIcons[driver.status]}
                        label={statusLabels[driver.status]}
                        size="small"
                        color={statusColors[driver.status]}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Permis valide jusqu'au {format(new Date(driver.license_expiry), 'dd MMMM yyyy', { locale: fr })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </DriverCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDriver ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro de permis"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Expiration du permis"
                value={formData.license_expiry}
                onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Statut"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Driver['status'] })}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la photo"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                helperText="Optionnel"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.phone}
          >
            {editingDriver ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyDrivers;
