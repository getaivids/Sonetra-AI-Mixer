import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Chip,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  Settings2,
  Settings,
  BarChart,
  Play,
  Pause,
  Volume2,
  Download,
  Plus,
  TrendingUp,
  Clock,
  Headphones,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const recentProjects = [
    {
      id: 1,
      name: 'Electronic Mix 001',
      genre: 'Electronic',
      duration: '3:45',
      progress: 85,
      lastModified: '2 hours ago',
    },
    {
      id: 2,
      name: 'Jazz Fusion Master',
      genre: 'Jazz',
      duration: '5:12',
      progress: 60,
      lastModified: '1 day ago',
    },
    {
      id: 3,
      name: 'Rock Anthem v2',
      genre: 'Rock',
      duration: '4:28',
      progress: 40,
      lastModified: '3 days ago',
    },
  ];

  const quickStats = [
    {
      label: 'Projects',
      value: '12',
      change: '+3',
      icon: Music,
      color: '#6366f1',
    },
    {
      label: 'Hours Mixed',
      value: '48',
      change: '+12',
      icon: Mixer,
      color: '#8b5cf6',
    },
    {
      label: 'Tracks Mastered',
      value: '24',
      change: '+8',
      icon: Settings,
      color: '#10b981',
    },
    {
      label: 'AI Suggestions',
      value: '156',
      change: '+42',
      icon: TrendingUp,
      color: '#f59e0b',
    },
  ];

  const quickActions = [
    {
      title: 'New Project',
      description: 'Start a fresh mixing session',
      icon: Plus,
      action: () => navigate('/studio'),
      color: '#6366f1',
    },
    {
      title: 'Upload Tracks',
      description: 'Import audio files for processing',
      icon: Music,
      action: () => navigate('/studio'),
      color: '#8b5cf6',
    },
    {
      title: 'AI Analysis',
      description: 'Analyze your tracks with AI',
      icon: BarChart,
      action: () => navigate('/analysis'),
      color: '#10b981',
    },
    {
      title: 'Mixing Console',
      description: 'Open professional mixing tools',
      icon: Mixer,
      action: () => navigate('/mixing'),
      color: '#f59e0b',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
          }}
        >
          Welcome to SONETRA
        </Typography>
        <Typography variant="h6" color="text.secondary">
          AI-Powered Music Production Platform
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(26, 26, 58, 0.6)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: stat.color + '20',
                        color: stat.color,
                      }}
                    >
                      <Icon size={24} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" fontWeight={700}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Chip
                        label={stat.change}
                        size="small"
                        sx={{
                          mt: 0.5,
                          fontSize: '0.7rem',
                          backgroundColor: '#10b981' + '20',
                          color: '#10b981',
                        }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Grid item xs={12} sm={6} key={action.title}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        background: 'rgba(26, 26, 58, 0.6)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={action.action}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: action.color + '20',
                            color: action.color,
                            width: 'fit-content',
                            mb: 2,
                          }}
                        >
                          <Icon size={24} />
                        </Box>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Recent Projects
          </Typography>
          <Stack spacing={2}>
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(26, 26, 58, 0.6)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(26, 26, 58, 0.8)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: 'primary.main' + '20',
                        color: 'primary.main',
                        mr: 2,
                      }}
                    >
                      <Music size={20} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {project.name}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          label={project.genre}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          <Clock size={12} style={{ marginRight: 4 }} />
                          {project.duration}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {project.lastModified}
                        </Typography>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small">
                        <Play size={16} />
                      </IconButton>
                      <IconButton size="small">
                        <Download size={16} />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Dashboard;