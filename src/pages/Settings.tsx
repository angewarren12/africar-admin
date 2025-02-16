import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Save,
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  LocationCity,
  Business,
} from '@mui/icons-material';

interface SystemSettings {
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  city: string;
  country: string;
  commissionRate: number;
  minimumBookingAmount: number;
  maximumBookingAmount: number;
  features: {
    enableSeatSelection: boolean;
    enableLoyaltyPoints: boolean;
    enablePromotions: boolean;
    enableRealTimeTracking: boolean;
    enableAutoRefunds: boolean;
    enablePushNotifications: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    enableTwoFactorAuth: boolean;
    passwordExpiryDays: number;
    maxLoginAttempts: number;
  };
}

const defaultSettings: SystemSettings = {
  companyName: 'AfriCar',
  supportEmail: 'support@africar.com',
  supportPhone: '+225 0123456789',
  address: '123 Rue du Commerce',
  city: 'Abidjan',
  country: 'Côte d\'Ivoire',
  commissionRate: 10,
  minimumBookingAmount: 1000,
  maximumBookingAmount: 100000,
  features: {
    enableSeatSelection: true,
    enableLoyaltyPoints: true,
    enablePromotions: true,
    enableRealTimeTracking: true,
    enableAutoRefunds: false,
    enablePushNotifications: true,
  },
  security: {
    requireEmailVerification: true,
    requirePhoneVerification: true,
    enableTwoFactorAuth: false,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
  },
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFeatureChange = (feature: keyof SystemSettings['features']) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [feature]: !settings.features[feature],
      },
    });
  };

  const handleSecurityChange = (setting: keyof SystemSettings['security']) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [setting]: !settings.security[setting],
      },
    });
  };

  const handleSave = () => {
    // Ici, vous implémenteriez la logique pour sauvegarder les paramètres
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Paramètres du Système
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Les paramètres ont été sauvegardés avec succès !
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Informations de la compagnie */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations de la Compagnie
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nom de la compagnie"
                  value={settings.companyName}
                  onChange={(e) =>
                    setSettings({ ...settings, companyName: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Email de support"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Téléphone de support"
                  value={settings.supportPhone}
                  onChange={(e) =>
                    setSettings({ ...settings, supportPhone: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Adresse"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCity />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Paramètres financiers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Paramètres Financiers
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Taux de commission (%)"
                  value={settings.commissionRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commissionRate: Number(e.target.value),
                    })
                  }
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Montant minimum de réservation"
                  value={settings.minimumBookingAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minimumBookingAmount: Number(e.target.value),
                    })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">FCFA</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Montant maximum de réservation"
                  value={settings.maximumBookingAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maximumBookingAmount: Number(e.target.value),
                    })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">FCFA</InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Fonctionnalités */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fonctionnalités
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.enableSeatSelection}
                      onChange={() => handleFeatureChange('enableSeatSelection')}
                    />
                  }
                  label="Sélection des sièges"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.enableLoyaltyPoints}
                      onChange={() => handleFeatureChange('enableLoyaltyPoints')}
                    />
                  }
                  label="Programme de fidélité"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.enablePromotions}
                      onChange={() => handleFeatureChange('enablePromotions')}
                    />
                  }
                  label="Système de promotions"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.enableRealTimeTracking}
                      onChange={() => handleFeatureChange('enableRealTimeTracking')}
                    />
                  }
                  label="Suivi en temps réel"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.enableAutoRefunds}
                      onChange={() => handleFeatureChange('enableAutoRefunds')}
                    />
                  }
                  label="Remboursements automatiques"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.enablePushNotifications}
                      onChange={() => handleFeatureChange('enablePushNotifications')}
                    />
                  }
                  label="Notifications push"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sécurité */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sécurité
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.requireEmailVerification}
                      onChange={() => handleSecurityChange('requireEmailVerification')}
                    />
                  }
                  label="Vérification par email obligatoire"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.requirePhoneVerification}
                      onChange={() => handleSecurityChange('requirePhoneVerification')}
                    />
                  }
                  label="Vérification par téléphone obligatoire"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.enableTwoFactorAuth}
                      onChange={() => handleSecurityChange('enableTwoFactorAuth')}
                    />
                  }
                  label="Authentification à deux facteurs"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Expiration du mot de passe (jours)"
                  value={settings.security.passwordExpiryDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordExpiryDays: Number(e.target.value),
                      },
                    })
                  }
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Tentatives de connexion maximales"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        maxLoginAttempts: Number(e.target.value),
                      },
                    })
                  }
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          size="large"
        >
          Sauvegarder les Paramètres
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
