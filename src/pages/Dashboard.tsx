import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  alpha,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Skeleton,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  DirectionsBus as BusIcon,
  BookOnline as BookingIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { API_BASE_URL } from '../config/api';

// Types
interface DashboardStats {
  customers: {
    total_customers: number;
    active_customers: number;
    verified_customers: number;
    new_customers_30d: number;
  };
  companies: {
    total_companies: number;
    active_companies: number;
    new_companies_30d: number;
  };
  trips: {
    total_trips: number;
    upcoming_trips: number;
    new_trips_30d: number;
  };
  bookings: {
    total_bookings: number;
    pending_bookings: number;
    completed_bookings: number;
    revenue_30d: number;
  };
}

interface CustomerGrowth {
  month: string;
  new_customers: number;
  active_customers: number;
}

interface CompanyStats {
  id: number;
  name: string;
  city: string;
  total_trips: number;
  total_personnel: number;
}

interface TripStats {
  date: string;
  total_trips: number;
  companies_count: number;
}

interface Activity {
  type: 'new_customer' | 'new_company' | 'new_trip';
  id: number;
  name: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customerGrowth, setCustomerGrowth] = useState<CustomerGrowth[]>([]);
  const [companyStats, setCompanyStats] = useState<CompanyStats[]>([]);
  const [tripStats, setTripStats] = useState<TripStats[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, growthRes, companiesRes, tripsRes, activitiesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/stats`),
          fetch(`${API_BASE_URL}/api/dashboard/customer-growth`),
          fetch(`${API_BASE_URL}/api/dashboard/company-stats`),
          fetch(`${API_BASE_URL}/api/dashboard/trip-stats`),
          fetch(`${API_BASE_URL}/api/dashboard/recent-activities`),
        ]);

        if (!statsRes.ok || !growthRes.ok || !companiesRes.ok || !tripsRes.ok || !activitiesRes.ok) {
          throw new Error('Une ou plusieurs requêtes ont échoué');
        }

        const [statsData, growthData, companiesData, tripsData, activitiesData] = await Promise.all([
          statsRes.json(),
          growthRes.json(),
          companiesRes.json(),
          tripsRes.json(),
          activitiesRes.json(),
        ]);

        setStats(statsData);
        setCustomerGrowth(Array.isArray(growthData) ? growthData : []);
        setCompanyStats(Array.isArray(companiesData) ? companiesData : []);
        setTripStats(Array.isArray(tripsData) ? tripsData : []);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: number;
    subValue?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, subValue, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: alpha(color, 0.1),
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box flex={1}>
            <Typography variant="h4" component="div">
              {loading ? <Skeleton width={80} /> : value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loading ? <Skeleton width={120} /> : title}
            </Typography>
          </Box>
        </Box>
        {subValue && (
          <Typography variant="caption" color="text.secondary">
            {subValue}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clients"
            value={stats?.customers.total_customers || 0}
            subValue={`${stats?.customers.new_customers_30d || 0} nouveaux ce mois-ci`}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Compagnies"
            value={stats?.companies.total_companies || 0}
            subValue={`${stats?.companies.active_companies || 0} actives`}
            icon={<BusinessIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Trajets"
            value={stats?.trips.total_trips || 0}
            subValue={`${stats?.trips.upcoming_trips || 0} à venir`}
            icon={<BusIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Réservations"
            value={stats?.bookings.total_bookings || 0}
            subValue={`${stats?.bookings.pending_bookings || 0} en attente`}
            icon={<BookingIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Graphiques et tableaux */}
      <Grid container spacing={3}>
        {/* Croissance des clients */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Croissance des clients
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => format(parseISO(`${value}-01`), 'MMM yyyy', { locale: fr })}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [value.toLocaleString(), 'Clients']}
                    labelFormatter={(label) => format(parseISO(`${label}-01`), 'MMMM yyyy', { locale: fr })}
                  />
                  <Area
                    type="monotone"
                    dataKey="new_customers"
                    stackId="1"
                    stroke={theme.palette.primary.main}
                    fill={alpha(theme.palette.primary.main, 0.1)}
                    name="Nouveaux clients"
                  />
                  <Area
                    type="monotone"
                    dataKey="active_customers"
                    stackId="1"
                    stroke={theme.palette.success.main}
                    fill={alpha(theme.palette.success.main, 0.1)}
                    name="Clients actifs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Activités récentes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Activités récentes
            </Typography>
            {error ? (
              <Typography color="error" sx={{ p: 2 }}>
                {error}
              </Typography>
            ) : (
              <List>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <ListItem key={index} divider={index < 4}>
                      <ListItemIcon>
                        <Skeleton variant="circular" width={40} height={40} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Skeleton width={200} />}
                        secondary={<Skeleton width={100} />}
                      />
                    </ListItem>
                  ))
                ) : activities && activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <ListItem key={activity.id} divider={index < activities.length - 1}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor:
                              activity.type === 'new_customer'
                                ? theme.palette.primary.main
                                : activity.type === 'new_company'
                                ? theme.palette.success.main
                                : theme.palette.info.main,
                          }}
                        >
                          {activity.type === 'new_customer' ? (
                            <PersonIcon />
                          ) : activity.type === 'new_company' ? (
                            <BusinessIcon />
                          ) : (
                            <BusIcon />
                          )}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.name}
                        secondary={format(parseISO(activity.date), 'dd/MM/yyyy HH:mm', {
                          locale: fr,
                        })}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography color="textSecondary" sx={{ p: 2 }}>
                    Aucune activité récente
                  </Typography>
                )}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Statistiques des compagnies */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top compagnies
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="total_trips"
                    fill={theme.palette.primary.main}
                    name="Trajets"
                  />
                  <Bar
                    dataKey="total_personnel"
                    fill={theme.palette.success.main}
                    name="Personnel"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Statistiques des trajets */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Évolution des trajets
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tripStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(parseISO(value), 'dd/MM', { locale: fr })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(label) => format(parseISO(label), 'dd MMMM yyyy', { locale: fr })}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="total_trips"
                    stroke={theme.palette.primary.main}
                    name="Trajets"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="companies_count"
                    stroke={theme.palette.success.main}
                    name="Compagnies"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
