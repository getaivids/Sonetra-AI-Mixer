import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  BarChart2,
  Music,
  Brain,
  Target,
  TrendingUp,
  Volume2,
  Zap,
  Eye,
  Headphones,
  Radio,
  Heart,
  Sparkles,
} from 'lucide-react';

interface AnalysisData {
  tempo: number;
  key: string;
  mode: string;
  energy: number;
  danceability: number;
  valence: number;
  loudness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  genre: string;
  mood: string;
  dynamicRange: number;
  spectralCentroid: number;
  spectralRolloff: number;
  zeroCrossingRate: number;
  mfcc: number[];
  chroma: number[];
}

const Analysis = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>({
    tempo: 128.5,
    key: 'C',
    mode: 'Major',
    energy: 0.78,
    danceability: 0.82,
    valence: 0.65,
    loudness: -8.5,
    acousticness: 0.15,
    instrumentalness: 0.05,
    liveness: 0.12,
    speechiness: 0.08,
    genre: 'Electronic',
    mood: 'Energetic',
    dynamicRange: 8.2,
    spectralCentroid: 2150.5,
    spectralRolloff: 4200.8,
    zeroCrossingRate: 0.08,
    mfcc: [12.5, -8.2, 3.1, -1.8, 2.4, -0.9, 1.2, -0.5, 0.8, -0.3, 0.4, -0.2, 0.1],
    chroma: [0.8, 0.3, 0.6, 0.2, 0.9, 0.4, 0.7, 0.1, 0.5, 0.3, 0.6, 0.2],
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const musicFeatures = [
    {
      label: 'Energy',
      value: analysisData?.energy || 0,
      color: '#ef4444',
      icon: Zap,
      description: 'Intensity and power of the track',
    },
    {
      label: 'Danceability',
      value: analysisData?.danceability || 0,
      color: '#8b5cf6',
      icon: Music,
      description: 'How suitable for dancing',
    },
    {
      label: 'Valence',
      value: analysisData?.valence || 0,
      color: '#10b981',
      icon: Heart,
      description: 'Musical positivity conveyed',
    },
    {
      label: 'Acousticness',
      value: analysisData?.acousticness || 0,
      color: '#f59e0b',
      icon: Headphones,
      description: 'Acoustic vs electronic characteristics',
    },
    {
      label: 'Liveness',
      value: analysisData?.liveness || 0,
      color: '#6366f1',
      icon: Radio,
      description: 'Presence of live audience',
    },
    {
      label: 'Speechiness',
      value: analysisData?.speechiness || 0,
      color: '#ec4899',
      icon: Brain,
      description: 'Presence of spoken words',
    },
  ];

  const technicalMetrics = [
    {
      label: 'Tempo',
      value: `${analysisData?.tempo.toFixed(1)} BPM`,
      color: '#6366f1',
    },
    {
      label: 'Key',
      value: `${analysisData?.key} ${analysisData?.mode}`,
      color: '#8b5cf6',
    },
    {
      label: 'Loudness',
      value: `${analysisData?.loudness} dB`,
      color: '#ef4444',
    },
    {
      label: 'Dynamic Range',
      value: `${analysisData?.dynamicRange} dB`,
      color: '#10b981',
    },
    {
      label: 'Spectral Centroid',
      value: `${analysisData?.spectralCentroid.toFixed(0)} Hz`,
      color: '#f59e0b',
    },
    {
      label: 'Zero Crossing Rate',
      value: `${((analysisData?.zeroCrossingRate || 0) * 100).toFixed(1)}%`,
      color: '#ec4899',
    },
  ];

  const aiInsights = [
    {
      type: 'Genre',
      value: analysisData?.genre || 'Unknown',
      confidence: 92,
      color: '#6366f1',
    },
    {
      type: 'Mood',
      value: analysisData?.mood || 'Unknown',
      confidence: 88,
      color: '#8b5cf6',
    },
    {
      type: 'Best Platform',
      value: 'Spotify, Apple Music',
      confidence: 94,
      color: '#10b981',
    },
    {
      type: 'Target Audience',
      value: 'EDM Enthusiasts, Young Adults',
      confidence: 86,
      color: '#f59e0b',
    },
  ];

  const recommendations = [
    {
      title: 'Mixing Suggestion',
      description: 'Consider adding more compression to increase perceived loudness',
      priority: 'high',
      icon: Target,
    },
    {
      title: 'Mastering Tip',
      description: 'The track would benefit from multiband processing for better clarity',
      priority: 'medium',
      icon: Sparkles,
    },
    {
      title: 'Creative Enhancement',
      description: 'Try adding subtle reverb to create more spatial depth',
      priority: 'low',
      icon: Eye,
    },
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

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
          AI Analysis
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Deep audio analysis and intelligent insights
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Music Features */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              mb: 3,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Musical Features Analysis
              </Typography>
              <Button
                variant="contained"
                startIcon={<Brain size={20} />}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </Button>
            </Stack>

            <Grid container spacing={3}>
              {musicFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Grid item xs={12} sm={6} md={4} key={feature.label}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          background: 'rgba(37, 37, 69, 0.8)',
                          border: '1px solid rgba(99, 102, 241, 0.1)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                  backgroundColor: feature.color + '20',
                                  color: feature.color,
                                }}
                              >
                                <Icon size={20} />
                              </Box>
                              <Typography variant="h6" fontWeight={700}>
                                {Math.round(feature.value * 100)}%
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                {feature.label}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={feature.value * 100}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: feature.color,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                {feature.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>

          {/* Technical Metrics */}
          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Technical Analysis
            </Typography>
            <Grid container spacing={2}>
              {technicalMetrics.map((metric, index) => (
                <Grid item xs={12} sm={6} md={4} key={metric.label}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        borderRadius: 2,
                        backgroundColor: 'rgba(37, 37, 69, 0.4)',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {metric.label}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ color: metric.color }}
                      >
                        {metric.value}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* AI Insights & Recommendations */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              AI Insights
            </Typography>
            <Stack spacing={2}>
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      borderRadius: 2,
                      backgroundColor: 'rgba(37, 37, 69, 0.4)',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {insight.type}
                      </Typography>
                      <Chip
                        label={`${insight.confidence}%`}
                        size="small"
                        sx={{
                          backgroundColor: insight.color + '20',
                          color: insight.color,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Stack>
                    <Typography variant="body1" fontWeight={600}>
                      {insight.value}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </Paper>

          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              AI Recommendations
            </Typography>
            <Stack spacing={2}>
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                const priorityColor = {
                  high: '#ef4444',
                  medium: '#f59e0b',
                  low: '#10b981',
                };
                
                return (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Alert
                      severity="info"
                      icon={<Icon size={20} />}
                      sx={{
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        '& .MuiAlert-icon': {
                          color: priorityColor[rec.priority as keyof typeof priorityColor],
                        },
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                        {rec.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {rec.description}
                      </Typography>
                    </Alert>
                  </motion.div>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Analysis;