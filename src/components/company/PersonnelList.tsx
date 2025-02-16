import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Chip,
  Grid,
  styled,
  alpha,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsBus,
  Schedule,
  Search as SearchIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import AddPersonnelDialog from './dialogs/AddPersonnelDialog';
import EditPersonnelDialog from './dialogs/EditPersonnelDialog';
import DriverDetailsDialog from './dialogs/DriverDetailsDialog'; // Import the DriverDetailsDialog component
import { API_BASE_URL } from '../../config/api';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.1),
  '&:hover': {
    boxShadow: '0 8px 25px 0 rgba(0,0,0,0.1)',
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontSize: '1.5rem',
  fontWeight: 600,
  marginRight: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  height: '24px',
  fontSize: '0.75rem',
  fontWeight: 600,
  '&.MuiChip-colorSuccess': {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.dark,
  },
  '&.MuiChip-colorError': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.dark,
  },
  '&.MuiChip-colorWarning': {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.dark,
  },
}));

const InfoIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    color: alpha(theme.palette.primary.main, 0.7),
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

interface PersonnelListProps {
  companyId: number;
}

const PersonnelList: React.FC<PersonnelListProps> = ({ companyId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'driver' | 'agent'>('all');
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDriverDetailsOpen, setIsDriverDetailsOpen] = useState(false); // Add the isDriverDetailsOpen state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (companyId) {
      loadPersonnel();
    }
  }, [companyId, selectedType]);

  const loadPersonnel = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/api/companies/${companyId}/personnel${selectedType !== 'all' ? `?type=${selectedType}` : ''}`;
      console.log('Chargement du personnel:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Erreur lors du chargement du personnel');
      }
      
      const data = await response.json();
      setPersonnel(data);
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors du chargement du personnel', { 
        variant: 'error',
        autoHideDuration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPersonnel(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (person: Personnel) => {
    setSelectedPersonnel(person);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (person: Personnel) => {
    setSelectedPersonnel(person);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPersonnel) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${companyId}/personnel/${selectedPersonnel.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      enqueueSnackbar('Personnel supprimé avec succès', { variant: 'success' });
      setIsDeleteConfirmOpen(false);
      loadPersonnel();
    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Erreur lors de la suppression', { 
        variant: 'error' 
      });
    }
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    loadPersonnel();
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    loadPersonnel();
  };

  const filteredPersonnel = personnel.filter(person => {
    const searchLower = searchTerm.toLowerCase();
    return (
      person.first_name.toLowerCase().includes(searchLower) ||
      person.last_name.toLowerCase().includes(searchLower) ||
      person.email.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on_leave':
        return 'warning';
      default:
        return 'error';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'on_leave':
        return 'En congé';
      default:
        return status;
    }
  };

  const handlePersonnelClick = (person: Personnel) => {
    if (person.type === 'driver') {
      setSelectedPersonnel(person);
      setIsDriverDetailsOpen(true);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Personnel
        </Typography>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            placeholder="Rechercher un membre du personnel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'driver' | 'agent')}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="all">Tous les types</MenuItem>
              <MenuItem value="driver">Chauffeurs</MenuItem>
              <MenuItem value="agent">Agents</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
              }
            }}
          >
            Ajouter un membre
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPersonnel.map((person) => (
            <Grid item xs={12} sm={6} md={4} key={person.id}>
              <StyledCard 
                onClick={() => handlePersonnelClick(person)}
                sx={{ 
                  cursor: person.type === 'driver' ? 'pointer' : 'default',
                }}
              >
                <Box sx={{ p: 2 }}>
                  {/* En-tête de la carte */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <StyledAvatar>
                      {person.first_name[0]}{person.last_name[0]}
                    </StyledAvatar>
                    <Box flex={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="h6" fontWeight="600">
                          {person.first_name} {person.last_name}
                        </Typography>
                        <StatusChip
                          label={person.status === 'active' ? 'Actif' : person.status === 'inactive' ? 'Inactif' : 'En congé'}
                          color={person.status === 'active' ? 'success' : person.status === 'inactive' ? 'error' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="primary" fontWeight="500">
                        {person.type === 'driver' ? 'Chauffeur' : 'Agent'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Informations de contact */}
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
                    borderRadius: 2,
                    mb: 2
                  }}>
                    <InfoIcon>
                      <EmailIcon />
                      <Typography variant="body2">{person.email}</Typography>
                    </InfoIcon>
                    {person.phone && (
                      <InfoIcon sx={{ mt: 1 }}>
                        <PhoneIcon />
                        <Typography variant="body2">{person.phone}</Typography>
                      </InfoIcon>
                    )}
                    {person.type === 'driver' && person.license_number && (
                      <InfoIcon sx={{ mt: 1 }}>
                        <BadgeIcon />
                        <Typography variant="body2">{person.license_number}</Typography>
                      </InfoIcon>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {person.type === 'driver' && person.license_expiry_date && (
                      <Typography variant="caption" color="text.secondary">
                        Permis expire le: {new Date(person.license_expiry_date).toLocaleDateString()}
                      </Typography>
                    )}
                    <Box ml="auto">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(person);
                        }}
                        sx={{ 
                          color: 'primary.main',
                          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          mr: 1,
                          '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(person);
                        }}
                        sx={{ 
                          color: 'error.main',
                          backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
                          '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2),
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Dialogue d'ajout */}
      <AddPersonnelDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
        companyId={companyId}
      />

      {/* Dialogue de modification */}
      {selectedPersonnel && (
        <EditPersonnelDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handleEditSuccess}
          personnel={selectedPersonnel}
          companyId={companyId}
        />
      )}

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer {selectedPersonnel?.first_name} {selectedPersonnel?.last_name} ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteConfirmOpen(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue des détails du chauffeur */}
      <DriverDetailsDialog
        open={isDriverDetailsOpen}
        onClose={() => setIsDriverDetailsOpen(false)}
        driver={{
          id: selectedPersonnel?.id || 0,
          firstName: selectedPersonnel?.first_name || '',
          lastName: selectedPersonnel?.last_name || '',
          email: selectedPersonnel?.email || '',
          phone: selectedPersonnel?.phone || '',
          license: {
            number: selectedPersonnel?.license_number || '',
            expiryDate: selectedPersonnel?.license_expiry_date || '',
          },
          birthDate: selectedPersonnel?.birth_date || '',
          address: selectedPersonnel?.address || '',
          city: '',
          experience: 0,
          vehicleTypes: [],
          employmentType: 'fullTime',
          certifications: {
            firstAid: false,
            safety: false,
          },
          status: selectedPersonnel?.status === 'active' ? 'available' : 'offDuty',
          rating: 4.5,
          totalTrips: 0,
          totalHours: 0,
        }}
        onEdit={() => handleEdit(selectedPersonnel!)}
      />
    </Box>
  );
};

export default PersonnelList;
