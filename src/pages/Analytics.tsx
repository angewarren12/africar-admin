import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AnalyticsData, BookingStats, CompanyPerformance, RouteAnalytics } from '../types/analytics';
import { analyticsApi } from '../services/api';

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatCard = ({ title, value, subValue, color }: { title: string; value: string | number; subValue?: string; color?: string }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" color={color || 'primary'}>
        {value}
      </Typography>
      {subValue && (
        <Typography variant="body2" color="text.secondary">
          {subValue}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [data, setData] = useState<AnalyticsData>({} as AnalyticsData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const days = parseInt(timeRange);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const analyticsData = await analyticsApi.getAnalytics(timeRange);
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Vous pouvez ajouter une gestion d'erreur ici, comme afficher un message à l'utilisateur
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Tableau de bord analytique
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={timeRange}
            label="Période"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7">7 jours</MenuItem>
            <MenuItem value="30">30 jours</MenuItem>
            <MenuItem value="90">90 jours</MenuItem>
            <MenuItem value="365">1 an</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Cartes statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Réservations totales"
            value={data.bookingStats.total}
            subValue={`${data.bookingStats.completed} complétées`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Chiffre d'affaires total"
            value={`${data.bookingStats.revenue.toLocaleString()} FCFA`}
            subValue={`${data.bookingStats.averagePrice} FCFA/réservation`}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commission Africar"
            value={`${data.bookingStats.commission.totalAmount.toLocaleString()} FCFA`}
            subValue={`${data.bookingStats.commission.percentage}% du CA`}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commission moyenne"
            value={`${data.bookingStats.commission.averagePerBooking.toLocaleString()} FCFA`}
            subValue="par réservation"
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Graphique des revenus */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Évolution des revenus
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.revenueOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Revenus (FCFA)" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Graphiques de distribution */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Réservations par jour
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.bookingsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Réservations" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribution des segments clients
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.customerSegments}
                  dataKey="count"
                  nameKey="segment"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Tableau des meilleures compagnies */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance des compagnies
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Compagnie</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Réservations</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Revenu Total</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Commission Africar (15%)</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Revenu Net Compagnie</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Note</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Taux de complétion</th>
              </tr>
            </thead>
            <tbody>
              {data.topCompanies.map((company) => {
                const commission = Math.floor(company.revenue * 0.15);
                const netRevenue = company.revenue - commission;
                return (
                  <tr key={company.companyId}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{company.companyName}</td>
                    <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{company.totalBookings}</td>
                    <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{company.revenue.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd', color: 'primary.main' }}>{commission.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{netRevenue.toLocaleString()} FCFA</td>
                    <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{company.rating.toFixed(1)}/5</td>
                    <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{(company.completionRate * 100).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Paper>

      {/* Routes populaires */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Routes les plus populaires
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trajet</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Voyages</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Prix moyen</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Popularité</th>
              </tr>
            </thead>
            <tbody>
              {data.popularRoutes.map((route, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{`${route.departureCity} → ${route.arrivalCity}`}</td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{route.totalTrips}</td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{route.averagePrice.toLocaleString()} FCFA</td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>{(route.popularity * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
