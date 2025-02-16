import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  styled,
  alpha,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Person,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
    theme.palette.background.paper,
    0.95
  )} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  license_number: string;
  status: 'active' | 'inactive' | 'onLeave';
  created_at: string;
}

interface StaffListProps {
  drivers: Driver[];
}

const StaffList: React.FC<StaffListProps> = ({ drivers }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleAdd = () => {
    setSelectedDriver(null);
    setOpenDialog(true);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  const handleDelete = (driver: Driver) => {
    // TODO: Implémenter la suppression
    console.log('Suppression du chauffeur:', driver.id);
  };

  const handleSave = () => {
    // TODO: Implémenter la sauvegarde
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'onLeave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En service';
      case 'inactive':
        return 'Inactif';
      case 'onLeave':
        return 'En congé';
      default:
        return status;
    }
  };

  const getDriverInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id: number) => {
    const colors = [
      '#1976d2', // blue
      '#388e3c', // green
      '#d32f2f', // red
      '#f57c00', // orange
      '#7b1fa2', // purple
      '#0288d1', // light blue
      '#388e3c', // green
      '#fbc02d', // yellow
    ];
    return colors[id % colors.length];
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Personnel</Typography>
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
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Person sx={{ fontSize: 60, color: 'primary.main', opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary">
              Aucun chauffeur
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Ajouter votre premier chauffeur
            </Button>
          </Box>
        </StyledCard>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Chauffeur</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>N° Permis</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date d'ajout</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(driver.id),
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getDriverInitials(driver.first_name, driver.last_name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {driver.first_name} {driver.last_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{driver.phone}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <BadgeIcon fontSize="small" color="action" />
                      <Typography variant="body2">{driver.license_number}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(driver.status)}
                      size="small"
                      color={getStatusColor(driver.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(driver.created_at), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(driver)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(driver)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDriver ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Prénom"
              fullWidth
              defaultValue={selectedDriver?.first_name}
            />
            <TextField
              label="Nom"
              fullWidth
              defaultValue={selectedDriver?.last_name}
            />
            <TextField
              label="Téléphone"
              fullWidth
              defaultValue={selectedDriver?.phone}
            />
            <TextField
              label="Numéro de permis"
              fullWidth
              defaultValue={selectedDriver?.license_number}
            />
            <TextField
              select
              label="Statut"
              fullWidth
              defaultValue={selectedDriver?.status || 'active'}
            >
              <option value="active">En service</option>
              <option value="inactive">Inactif</option>
              <option value="onLeave">En congé</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedDriver ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffList;
