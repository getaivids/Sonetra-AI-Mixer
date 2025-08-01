import React, { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Button,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Music, 
  Settings2 as Mixer, 
  Settings, 
  BarChart,
  GitHub,
  Twitter,
  Menu,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 280;

const navigationItems = [
  { text: 'Dashboard', path: '/', icon: Home },
  { text: 'Studio', path: '/studio', icon: Music },
  { text: 'Mixing', path: '/mixing', icon: Mixer },
  { text: 'Mastering', path: '/mastering', icon: Settings },
  { text: 'Analysis', path: '/analysis', icon: BarChart },
];

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
            }}
          >
            SONETRA
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              mt: 0.5,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
            }}
          >
            AI POWERED MUSIC PLATFORM
          </Typography>
        </motion.div>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    color: isActive ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    <Icon size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 3, borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
        <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <GitHub size={18} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <Twitter size={18} />
          </IconButton>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            display: 'block',
            fontSize: '0.7rem',
          }}
        >
          © 2025 SONETRA AI
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          display: { md: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            SONETRA
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid rgba(99, 102, 241, 0.1)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)
            `,
            zIndex: 0,
          }}
        />
        
        <Container
          maxWidth={false}
          sx={{
            py: { xs: 10, md: 4 },
            px: { xs: 2, md: 4 },
            position: 'relative',
            zIndex: 1,
            height: '100%',
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;