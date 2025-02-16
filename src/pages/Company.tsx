import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import StationList from '../components/company/StationList';
import VehicleList from '../components/company/VehicleList';
import PersonnelList from '../components/company/PersonnelList';
import RouteList from '../components/company/RouteList';
import TripList from '../components/company/TripList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const Company: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/companies/${id}`);
      setCompany(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement de la compagnie:', err);
      setError('Erreur lors du chargement de la compagnie');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!company) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          Compagnie non trouvée
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {company.name}
        </Typography>
        <Typography color="text.secondary">
          {company.address}
        </Typography>
        <Typography color="text.secondary">
          {company.phone} • {company.email}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="company tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Stations" />
          <Tab label="Véhicules" />
          <Tab label="Personnel" />
          <Tab label="Routes" />
          <Tab label="Trajets" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <StationList />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <VehicleList />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PersonnelList />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <RouteList />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <TripList />
      </TabPanel>
    </Container>
  );
};

export default Company;
