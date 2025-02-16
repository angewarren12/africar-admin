import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Button,
  Grid,
  MenuItem,
  styled,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  IconButton,
  Avatar,
  FormHelperText,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PhotoCamera } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px 0 ${alpha(theme.palette.primary.main, 0.15)}`,
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '20%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  border: `4px solid ${theme.palette.background.paper}`,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '.MuiStepLabel-root': {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateX(4px)',
    }
  },
  '.MuiStepLabel-label': {
    fontWeight: 600,
    fontSize: '1.1rem',
  },
  '.MuiStepContent-root': {
    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    marginLeft: '12px',
    paddingLeft: theme.spacing(3),
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: '10px 24px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  }
}));

interface CompanyFormData {
  name: string;
  description: string;
  email: string;
  phone: string;
  website?: string;
  rccm?: string;
  taxNumber?: string;
  transportType: string[];
  logo?: File;
  // Contact supplémentaire
  alternateEmail?: string;
  alternatePhone?: string;
  whatsapp?: string;
  managerName: string;
  managerPosition: string;
  // Localisation
  address: string;
  city: string;
  postalCode?: string;
  district?: string;
  gpsCoordinates?: string;
  coverageAreas: string[];
  // Informations légales (optionnelles)
  legal_status?: string;
  creation_date?: string;
  // Informations sur l'assurance (optionnelles)
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_expiry_date?: string;
}

const initialFormData: CompanyFormData = {
  name: '',
  description: '',
  email: '',
  phone: '',
  website: '',
  rccm: '',
  taxNumber: '',
  transportType: [],
  alternateEmail: '',
  alternatePhone: '',
  whatsapp: '',
  managerName: '',
  managerPosition: '',
  address: '',
  city: '',
  postalCode: '',
  district: '',
  gpsCoordinates: '',
  coverageAreas: [],
  legal_status: '',
  creation_date: '',
  insurance_provider: '',
  insurance_policy_number: '',
  insurance_expiry_date: '',
};

const cities = [
  'Abidjan',
  'Bouaké',
  'Daloa',
  'Yamoussoukro',
  'San-Pédro',
  'Divo',
  'Korhogo',
  'Man',
  'Gagnoa',
  'Abengourou',
  'Anyama',
  'Séguéla',
  'Bondoukou',
  'Oumé',
  'Ferkessédougou',
  'Dimbokro',
  'Odienné',
  'Duékoué',
  'Dabou',
  'Grand-Bassam'
];

const transportTypes = [
  'Transport urbain',
  'Transport interurbain',
  'Transport mixte',
];

const NewCompany = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CompanyFormData>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleChange = (field: keyof CompanyFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultiSelectChange = (field: 'transportType' | 'coverageAreas') => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value as string[],
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<CompanyFormData> = {};

    switch (step) {
      case 0: // Informations de base
        if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
        if (!formData.email.trim()) {
          newErrors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "L'email n'est pas valide";
        }
        if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
        break;

      case 1: // Contact et Communication
        if (!formData.managerName.trim()) newErrors.managerName = 'Le nom du responsable est requis';
        if (!formData.managerPosition.trim()) newErrors.managerPosition = 'Le poste du responsable est requis';
        break;

      case 2: // Localisation
        if (!formData.address.trim()) newErrors.address = "L'adresse est requise";
        if (!formData.city) newErrors.city = 'La ville est requise';
        if (formData.coverageAreas.length === 0) newErrors.coverageAreas = 'Sélectionnez au moins une zone de couverture';
        break;

      case 3: // Informations légales et assurance (optionnelles)
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      // Valider le formulaire
      if (!validateStep(activeStep)) {
        setSubmitting(false);
        return;
      }

      // Préparer les données
      const formDataToSend = {
        ...formData,
        coverage_areas: formData.coverageAreas,
        transport_types: formData.transportType,
        manager_name: formData.managerName,
        manager_position: formData.managerPosition,
        alternate_email: formData.alternateEmail,
        alternate_phone: formData.alternatePhone,
        postal_code: formData.postalCode,
        latitude: formData.gpsCoordinates ? parseFloat(formData.gpsCoordinates) : null,
        longitude: formData.gpsCoordinates ? parseFloat(formData.gpsCoordinates) : null,
        registration_number: formData.rccm,
        tax_number: formData.taxNumber
      };

      console.log('📤 Données envoyées à l\'API:', formDataToSend);

      // Envoyer les données
      const response = await axios.post('http://localhost:3002/api/companies', formDataToSend);
      console.log('✅ Réponse de l\'API:', response.data);
      console.log('📄 Données enregistrées dans la BD:', response.data.company);

      // Afficher la notification de succès
      showNotification('Compagnie créée avec succès', 'success');

      // Attendre 2 secondes avant de rediriger
      setTimeout(() => {
        navigate('/companies');
      }, 2000);
    } catch (error) {
      console.error('❌ Erreur:', error);
      showNotification(
        error.response?.data?.message || 'Erreur lors de la création de la compagnie',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      label: 'Informations de base',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
            <Box position="relative">
              <StyledAvatar
                src={logoPreview || ''}
              />
              <IconButton
                color="primary"
                aria-label="upload logo"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                }}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleLogoChange}
                />
                <PhotoCamera />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom de la compagnie"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={formData.phone}
              onChange={handleChange('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Site web"
              value={formData.website}
              onChange={handleChange('website')}
              placeholder="https://"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Type de transport</InputLabel>
              <Select
                multiple
                value={formData.transportType}
                onChange={handleMultiSelectChange('transportType')}
                input={<OutlinedInput label="Type de transport" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {transportTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Contact et Communication',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom du responsable"
              value={formData.managerName}
              onChange={handleChange('managerName')}
              error={!!errors.managerName}
              helperText={errors.managerName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Poste du responsable"
              value={formData.managerPosition}
              onChange={handleChange('managerPosition')}
              error={!!errors.managerPosition}
              helperText={errors.managerPosition}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email secondaire"
              type="email"
              value={formData.alternateEmail}
              onChange={handleChange('alternateEmail')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone secondaire"
              value={formData.alternatePhone}
              onChange={handleChange('alternatePhone')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="WhatsApp"
              value={formData.whatsapp}
              onChange={handleChange('whatsapp')}
              placeholder="+225"
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Localisation',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              value={formData.address}
              onChange={handleChange('address')}
              error={!!errors.address}
              helperText={errors.address}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Ville"
              value={formData.city}
              onChange={handleChange('city')}
              error={!!errors.city}
              helperText={errors.city}
              required
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Code postal"
              value={formData.postalCode}
              onChange={handleChange('postalCode')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Quartier/Zone"
              value={formData.district}
              onChange={handleChange('district')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={formData.gpsCoordinates}
              onChange={handleChange('gpsCoordinates')}
              placeholder="ex: 5.3484"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={formData.gpsCoordinates}
              onChange={handleChange('gpsCoordinates')}
              placeholder="ex: -4.0083"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.coverageAreas}>
              <InputLabel>Zones de couverture</InputLabel>
              <Select
                multiple
                value={formData.coverageAreas}
                onChange={handleMultiSelectChange('coverageAreas')}
                input={<OutlinedInput label="Zones de couverture" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                required
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
              {errors.coverageAreas && (
                <FormHelperText>{errors.coverageAreas}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Informations légales et assurance (Optionnel)',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Ces informations sont optionnelles et peuvent être complétées ultérieurement.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Numéro RCCM"
              value={formData.rccm}
              onChange={handleChange('rccm')}
              placeholder="Numéro du registre de commerce"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="NINEA"
              value={formData.taxNumber}
              onChange={handleChange('taxNumber')}
              placeholder="Numéro d'identification fiscale"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Statut juridique"
              value={formData.legal_status}
              onChange={handleChange('legal_status')}
              placeholder="ex: SARL, SA, etc."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Date de création"
              value={formData.creation_date}
              onChange={handleChange('creation_date')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Compagnie d'assurance"
              value={formData.insurance_provider}
              onChange={handleChange('insurance_provider')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Numéro de police d'assurance"
              value={formData.insurance_policy_number}
              onChange={handleChange('insurance_policy_number')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Date d'expiration de l'assurance"
              value={formData.insurance_expiry_date}
              onChange={handleChange('insurance_expiry_date')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Container maxWidth="md">
      <Box mb={6} textAlign="center">
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 2
          }}
        >
          Nouvelle Compagnie
        </Typography>
        <Typography 
          color="text.secondary"
          variant="h6"
          sx={{ 
            maxWidth: '600px',
            margin: '0 auto',
            opacity: 0.8
          }}
        >
          Créez une nouvelle compagnie de transport en quelques étapes simples
        </Typography>
      </Box>

      <StyledCard>
        <StyledStepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mt: 3, mb: 3 }}>{step.content}</Box>
                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                  <StyledButton
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                    sx={{
                      background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    }}
                  >
                    {index === steps.length - 1 ? 'Créer la compagnie' : 'Suivant'}
                  </StyledButton>
                  {index > 0 && (
                    <StyledButton
                      onClick={handleBack}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                          background: (theme) => alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      Retour
                    </StyledButton>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </StyledStepper>
      </StyledCard>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewCompany;
