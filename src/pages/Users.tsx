import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Block,
  CheckCircle,
  MoreVert,
} from '@mui/icons-material';
import { User } from '../types';

// Données simulées des utilisateurs
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Kouassi Yao',
    email: 'kouassi.yao@email.com',
    phone: '+225 0123456789',
    status: 'active',
    totalTrips: 15,
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Koffi Marie',
    email: 'koffi.marie@email.com',
    phone: '+225 0123456790',
    status: 'suspended',
    totalTrips: 8,
    joinDate: '2024-01-10',
  },
  // Ajoutez plus d'utilisateurs ici
];

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h5" gutterBottom>
          Gestion des Utilisateurs
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Trajets</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 'active' ? 'Actif' : 'Suspendu'}
                      color={user.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.totalTrips}</TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton
                      color={user.status === 'active' ? 'error' : 'success'}
                      size="small"
                      title={user.status === 'active' ? 'Suspendre' : 'Activer'}
                    >
                      {user.status === 'active' ? <Block /> : <CheckCircle />}
                    </IconButton>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
        />
      </TableContainer>
    </Box>
  );
};

export default Users;
