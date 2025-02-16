import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  styled,
  alpha,
  IconButton,
  useTheme,
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  DirectionsCar as DirectionsCarIcon,
  LocalOffer as LocalOfferIcon,
  ReportProblem as ReportProblemIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  BookOnline as BookOnlineIcon,
  BarChart as BarChartIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  DirectionsBus as DirectionsBusIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const drawerWidth = 280;
const closedDrawerWidth = 65; // Width when drawer is closed

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : closedDrawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : closedDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRight: 'none',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: '4px 8px',
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white,
    },
  },
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.2),
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: theme.palette.common.white,
    },
  },
  '& .MuiListItemIcon-root': {
    color: alpha(theme.palette.common.white, 0.7),
  },
  '& .MuiListItemText-primary': {
    color: alpha(theme.palette.common.white, 0.9),
  },
}));

const menuItems = [
  {
    text: 'Tableau de bord',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    text: 'Compagnies',
    icon: <BusinessIcon />,
    path: '/companies',
  },
  {
    text: 'Clients',
    icon: <PeopleIcon />,
    path: '/customers',
  },
  {
    text: 'Réservations',
    icon: <BookOnlineIcon />,
    path: '/bookings',
  },
  {
    text: 'Promotions',
    icon: <LocalOfferIcon />,
    path: '/promotions',
  },
  {
    text: 'Réclamations',
    icon: <ReportProblemIcon />,
    path: '/complaints',
  },
  {
    text: 'Analytiques',
    icon: <BarChartIcon />,
    path: '/analytics',
  },
  {
    text: 'Paramètres',
    icon: <SettingsIcon />,
    path: '/settings',
  },
];

const DashboardLayout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.text : 'Super Administrateur';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 2 }}>
              Super Administrateur
            </Typography>
            {location.pathname !== '/' && (
              <>
                <ChevronLeftIcon sx={{ mx: 1, color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="subtitle1" noWrap component="div" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {getCurrentPageTitle()}
                </Typography>
              </>
            )}
          </Box>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.common.white, 0.2) }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer variant="permanent" open={open}>
        <Toolbar />
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => (
            <StyledListItem
              key={item.text}
              button
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ 
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 0, 
                  mr: open ? 2 : 'auto', 
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  transition: theme.transitions.create('opacity', {
                    duration: theme.transitions.duration.shorter,
                  }),
                }} 
              />
            </StyledListItem>
          ))}
        </List>
      </StyledDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : closedDrawerWidth}px)` },
          ml: `${closedDrawerWidth}px`,
          transition: theme.transitions.create(['width', 'margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
