import React, { useState } from 'react';
import {
  AppBar as MuiAppBar,
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
  Toolbar,
  styled,
} from '@mui/material';
import {
  Notifications,
  Settings,
  Logout,
  Person,
  Circle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  width: { sm: `calc(100% - ${drawerWidth}px)` },
  marginLeft: { sm: `${drawerWidth}px` },
  zIndex: theme.zIndex.drawer + 1,
}));

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

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [notifications] = useState(mockNotifications);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Super Administrateur
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton color="inherit" onClick={handleProfileClick}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
              <Person />
            </Avatar>
          </IconButton>
        </Box>

        {/* Menu Notifications */}
        <Popover
          open={Boolean(notificationAnchor)}
          anchorEl={notificationAnchor}
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
          <Box sx={{ width: 360, maxHeight: 400, overflow: 'auto' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <List>
              {notifications.map((notification) => (
                <ListItem key={notification.id} sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: notification.type === 'error' ? 'error.light' : 
                               notification.type === 'warning' ? 'warning.light' : 
                               'info.light' 
                    }}>
                      <Circle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                    primaryTypographyProps={{
                      variant: 'body1',
                      fontWeight: notification.read ? 'normal' : 'bold',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>

        {/* Menu Profile */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppBar;
