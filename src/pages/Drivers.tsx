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
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { mockDrivers, mockStations } from '../data/mockData';
import { Driver } from '../types';

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: '',
    contact: '',
    licenseNumber: '',
    status: 'pending',
    documents: [],
  });

  const handleAddDriver = () => {
    const driver: Driver = {
      id: (drivers.length + 1).toString(),
      name: newDriver.name || '',
      contact: newDriver.contact || '',
      licenseNumber: newDriver.licenseNumber || '',
      status: 'pending',
      documents: [],
      assignedStation: newDriver.assignedStation,
      createdAt: new Date().toISOString(),
    };
    setDrivers([...drivers, driver]);
    setOpenDialog(false);
    setNewDriver({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Chauffeurs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Ajouter un Chauffeur
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Numéro de Permis</TableCell>
              <TableCell>Gare Assignée</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date de Création</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.contact}</TableCell>
                <TableCell>{driver.licenseNumber}</TableCell>
                <TableCell>
                  {mockStations.find(s => s.id === driver.assignedStation)?.name || '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={driver.status}
                    color={getStatusColor(driver.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(driver.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button size="small" color="primary">
                    Modifier
                  </Button>
                  <Button size="small" color="error">
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ajouter un Nouveau Chauffeur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du Chauffeur"
                value={newDriver.name}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact"
                value={newDriver.contact}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, contact: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Numéro de Permis"
                value={newDriver.licenseNumber}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, licenseNumber: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Gare Assignée"
                value={newDriver.assignedStation || ''}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, assignedStation: e.target.value })
                }
              >
                {mockStations.map((station) => (
                  <MenuItem key={station.id} value={station.id}>
                    {station.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleAddDriver} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Drivers;
