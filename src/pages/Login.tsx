import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  useTheme,
  Link,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  DirectionsBus,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorType = err.response?.data?.error;
      switch (errorType) {
        case 'EMAIL_NOT_FOUND':
          setError('Cette adresse email n\'existe pas dans notre système');
          break;
        case 'INVALID_PASSWORD':
          setError('Le mot de passe est incorrect');
          break;
        default:
          setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MotionPaper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <MotionBox
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <DirectionsBus
              sx={{
                fontSize: 40,
                color: 'primary.main',
                mr: 2,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              AfriCar
            </Typography>
          </MotionBox>

          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Connexion Super Admin
          </Typography>

          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2,
                p: 1,
                bgcolor: 'error.light',
                color: 'error.contrastText',
                borderRadius: 1
              }}
            >
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <MotionBox
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </MotionBox>

            <MotionBox
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <TextField
                fullWidth
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MotionBox>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            sx={{ mt: 3, textAlign: 'center' }}
          >
            <Link href="#" underline="hover" sx={{ color: 'text.secondary' }}>
              Mot de passe oublié ?
            </Link>
          </MotionBox>
        </MotionPaper>
      </MotionBox>
    </Box>
  );
};

export default Login;
