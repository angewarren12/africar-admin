import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Download,
  Print,
  Refresh,
  CalendarToday,
  Business,
  Person,
  DirectionsBus,
  LocationOn,
} from '@mui/icons-material';
import { format } from 'date-fns';
import bookingService, { Booking } from '../services/bookingService';
import { fr } from 'date-fns/locale';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionAnchorEl, setActionAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: Booking['status']) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      await fetchBookings(); // Refresh the list
      handleActionClose(bookingId);
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, bookingId: number) => {
    setActionAnchorEl({ ...actionAnchorEl, [bookingId]: event.currentTarget });
  };

  const handleActionClose = (bookingId: number) => {
    setActionAnchorEl({ ...actionAnchorEl, [bookingId]: null });
  };

  const handleOpenDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
    handleActionClose(booking.booking_id);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const searchMatch = 
      booking.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.departure_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.arrival_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.registration_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmé';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <Box p={3}>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h5" gutterBottom>
                      Réservations
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={fetchBookings}
                      >
                        Actualiser
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                      >
                        Exporter
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Print />}
                      >
                        Imprimer
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        placeholder="Rechercher une réservation..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                      >
                        Filtrer
                      </Button>
                      <Menu
                        anchorEl={filterAnchorEl}
                        open={Boolean(filterAnchorEl)}
                        onClose={() => setFilterAnchorEl(null)}
                      >
                        <MenuItem onClick={() => { setStatusFilter('all'); setFilterAnchorEl(null); }}>
                          Tous
                        </MenuItem>
                        <MenuItem onClick={() => { setStatusFilter('pending'); setFilterAnchorEl(null); }}>
                          En attente
                        </MenuItem>
                        <MenuItem onClick={() => { setStatusFilter('confirmed'); setFilterAnchorEl(null); }}>
                          Confirmé
                        </MenuItem>
                        <MenuItem onClick={() => { setStatusFilter('completed'); setFilterAnchorEl(null); }}>
                          Terminé
                        </MenuItem>
                        <MenuItem onClick={() => { setStatusFilter('cancelled'); setFilterAnchorEl(null); }}>
                          Annulé
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                </Box>

                <TableContainer component={Paper} sx={{ mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Client</StyledTableCell>
                        <StyledTableCell>Trajet</StyledTableCell>
                        <StyledTableCell>Véhicule</StyledTableCell>
                        <StyledTableCell>Départ</StyledTableCell>
                        <StyledTableCell>Places</StyledTableCell>
                        <StyledTableCell>Prix</StyledTableCell>
                        <StyledTableCell>Statut</StyledTableCell>
                        <StyledTableCell>Actions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <StyledTableRow key={booking.booking_id}>
                          <StyledTableCell>{booking.booking_id}</StyledTableCell>
                          <StyledTableCell>
                            {format(new Date(booking.created_at), 'dd/MM/yyyy', { locale: fr })}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Person fontSize="small" />
                              <Box>
                                <Typography variant="body2">
                                  {`${booking.first_name} ${booking.last_name}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {booking.phone}
                                </Typography>
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LocationOn fontSize="small" />
                              <Box>
                                <Typography variant="body2">
                                  {booking.departure_city} → {booking.arrival_city}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {`${booking.distance}km • ${booking.duration}min`}
                                </Typography>
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            {booking.registration_number && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <DirectionsBus fontSize="small" />
                                <Box>
                                  <Typography variant="body2">
                                    {booking.registration_number}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {`${booking.brand} ${booking.model}`}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday fontSize="small" />
                              <Box>
                                <Typography variant="body2">
                                  {format(new Date(booking.departure_time), 'HH:mm', { locale: fr })}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {format(new Date(booking.departure_time), 'dd/MM/yyyy', { locale: fr })}
                                </Typography>
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>{booking.seats_booked}</StyledTableCell>
                          <StyledTableCell>{booking.total_amount} FCFA</StyledTableCell>
                          <StyledTableCell>
                            <Chip
                              label={getStatusLabel(booking.status)}
                              color={getStatusColor(booking.status) as any}
                              size="small"
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => handleActionClick(e, booking.booking_id)}
                            >
                              <MoreVert />
                            </IconButton>
                            <Menu
                              anchorEl={actionAnchorEl[booking.booking_id]}
                              open={Boolean(actionAnchorEl[booking.booking_id])}
                              onClose={() => handleActionClose(booking.booking_id)}
                            >
                              <MenuItem onClick={() => handleOpenDetails(booking)}>
                                Détails
                              </MenuItem>
                              <MenuItem onClick={() => {
                                handleStatusUpdate(booking.booking_id, 'confirmed');
                              }}>
                                Confirmer
                              </MenuItem>
                              <MenuItem onClick={() => {
                                handleStatusUpdate(booking.booking_id, 'completed');
                              }}>
                                Marquer comme terminé
                              </MenuItem>
                              <MenuItem onClick={() => {
                                handleStatusUpdate(booking.booking_id, 'cancelled');
                              }}>
                                Annuler
                              </MenuItem>
                            </Menu>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
      {/* Booking Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedBooking && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Détails de la Réservation #{selectedBooking.booking_id}
                </Typography>
                <Chip
                  label={getStatusLabel(selectedBooking.status)}
                  color={getStatusColor(selectedBooking.status) as any}
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Client Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Informations Client
                  </Typography>
                  <Box ml={4}>
                    <Typography variant="body1">
                      {selectedBooking.first_name} {selectedBooking.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {selectedBooking.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Téléphone: {selectedBooking.phone}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Trip Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Informations Trajet
                  </Typography>
                  <Box ml={4}>
                    <Typography variant="body1">
                      {selectedBooking.departure_city} → {selectedBooking.arrival_city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Distance: {selectedBooking.distance} km
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Durée estimée: {selectedBooking.duration} minutes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Départ: {format(new Date(selectedBooking.departure_time), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Arrivée: {format(new Date(selectedBooking.arrival_time), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Vehicle Information */}
                {selectedBooking.registration_number && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        <DirectionsBus sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Informations Véhicule
                      </Typography>
                      <Box ml={4}>
                        <Typography variant="body1">
                          {selectedBooking.brand} {selectedBooking.model}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Immatriculation: {selectedBooking.registration_number}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </>
                )}

                {/* Booking Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Informations Réservation
                  </Typography>
                  <Box ml={4}>
                    <Typography variant="body1">
                      Places réservées: {selectedBooking.seats_booked}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prix total: {selectedBooking.total_amount} FCFA
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Réservé le: {format(new Date(selectedBooking.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </Typography>
                    {selectedBooking.passenger_info && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Informations Passagers:
                        </Typography>
                        <Box component="pre" sx={{ 
                          mt: 1, 
                          p: 2, 
                          bgcolor: 'grey.100', 
                          borderRadius: 1,
                          overflow: 'auto',
                          maxHeight: 200
                        }}>
                          {JSON.stringify(selectedBooking.passenger_info, null, 2)}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>
                Fermer
              </Button>
              {selectedBooking.status === 'pending' && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    handleStatusUpdate(selectedBooking.booking_id, 'confirmed');
                    handleCloseDetails();
                  }}
                >
                  Confirmer la Réservation
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Bookings;
