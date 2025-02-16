import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  TablePagination,
  Avatar,
  styled,
  alpha,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { API_BASE_URL } from '../config/api';
import { useSnackbar } from 'notistack';
import CustomerDetailsDialog from '../components/customers/CustomerDetailsDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  '&.MuiTableCell-head': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

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
  city: string;
  country: string;
  account_status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  phone_verified: boolean;
  last_login: string;
  created_at: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const loadCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des clients');
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger la liste des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (customerId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/customers/${customerId}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');

      await loadCustomers();
      enqueueSnackbar('Statut mis à jour avec succès', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Erreur lors de la mise à jour du statut', { variant: 'error' });
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(searchStr) ||
      customer.last_name.toLowerCase().includes(searchStr) ||
      customer.email.toLowerCase().includes(searchStr) ||
      customer.phone.includes(searchStr) ||
      customer.city.toLowerCase().includes(searchStr)
    );
  });

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' => {
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

  const getNextStatus = (currentStatus: string): string => {
    switch (currentStatus) {
      case 'active':
        return 'suspended';
      case 'suspended':
        return 'inactive';
      case 'inactive':
        return 'active';
      default:
        return 'active';
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom fontWeight="600">
        Gestion des Clients
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Client</StyledTableCell>
                  <StyledTableCell>Contact</StyledTableCell>
                  <StyledTableCell>Localisation</StyledTableCell>
                  <StyledTableCell>Vérification</StyledTableCell>
                  <StyledTableCell>Statut</StyledTableCell>
                  <StyledTableCell>Dernière connexion</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => (
                    <TableRow
                      key={customer.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={customer.profile_photo || undefined}
                            alt={`${customer.first_name} ${customer.last_name}`}
                          />
                          <Box>
                            <Typography variant="body1" fontWeight="500">
                              {customer.first_name} {customer.last_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Inscrit le{' '}
                              {format(new Date(customer.created_at), 'dd MMM yyyy', {
                                locale: fr,
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{customer.email}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{customer.phone}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{customer.city}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {customer.country}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Email vérifié">
                            <Box>
                              {customer.email_verified ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <BlockIcon color="error" />
                              )}
                            </Box>
                          </Tooltip>
                          <Tooltip title="Téléphone vérifié">
                            <Box>
                              {customer.phone_verified ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <BlockIcon color="error" />
                              )}
                            </Box>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StyledChip
                          label={getStatusLabel(customer.account_status)}
                          color={getStatusColor(customer.account_status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {customer.last_login
                          ? format(new Date(customer.last_login), 'dd/MM/yyyy HH:mm', {
                              locale: fr,
                            })
                          : 'Jamais connecté'}
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                          <Tooltip title="Voir les détails">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Changer le statut">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleStatusChange(
                                  customer.id,
                                  getNextStatus(customer.account_status)
                                )
                              }
                            >
                              {customer.account_status === 'active' ? (
                                <BlockIcon fontSize="small" color="error" />
                              ) : (
                                <CheckCircleIcon
                                  fontSize="small"
                                  color="success"
                                />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div"
          count={filteredCustomers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count}`
          }
        />
      </Paper>

      {selectedCustomer && (
        <CustomerDetailsDialog
          open={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          onUpdate={loadCustomers}
        />
      )}
    </Box>
  );
};

export default Customers;
