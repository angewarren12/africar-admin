import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Notifications,
  Settings,
  Logout,
  Person,
  Circle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Notifications simulées
const mockNotifications = [
  {
    id: 1,
    type: 'info',
    message: 'Nouvelle réservation #12345',
    time: '5 min',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    message: 'Retard signalé sur le trajet Abidjan-Yamoussoukro',
    time: '10 min',
    read: false,
  },
  {
    id: 3,
    type: 'error',
    message: 'Réclamation urgente #789',
    time: '15 min',
    read: false,
  },
];

export const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    // Logique de déconnexion ici
    navigate('/login');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      p: 2,
      bgcolor: 'background.paper',
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo.svg" alt="AfriCar Logo" style={{ height: 40 }} />
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Notifications */}
        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={unreadNotifications} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* User Menu */}
        <IconButton onClick={handleMenu}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Person />
          </Avatar>
        </IconButton>
      </Box>

      {/* User Menu Popover */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Paramètres
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Déconnexion
        </MenuItem>
      </Menu>

      {/* Notifications Popover */}
      <Popover
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List sx={{ width: 360, maxWidth: '100%' }}>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: 
                      notification.type === 'error' ? 'error.main' :
                      notification.type === 'warning' ? 'warning.main' :
                      'info.main'
                  }}>
                    <Circle />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.message}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {notification.time}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Popover>
    </Box>
  );
};
