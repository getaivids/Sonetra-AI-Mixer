import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Slider,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Volume2,
  Zap,
  Settings,
  TrendingUp,
  BarChart2,
  Target,
  Sparkles,
  Download,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface MasteringSettings {
  loudness: number;
  dynamicRange: number;
  stereoWidth: number;
  lowEndTightness: number;
  highEndBrightness: number;
  midPresence: number;
  compression: number;
  limiting: number;
  saturation: number;
  stereoEnhancement: boolean;
  multiband: boolean;
  vintage: boolean;
}

const Mastering = () => {
  const [settings, setSettings] = useState<MasteringSettings>({
    loudness: -14,
    dynamicRange: 8,
    stereoWidth: 100,
    lowEndTightness: 50,
    highEndBrightness: 50,
    midPresence: 50,
    compression: 30,
    limiting: 70,
    saturation: 15,
    stereoEnhancement: true,
    multiband: false,
    vintage: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [isPlaying, setIsPlaying] = useState(false);

  const presets = [
    { value: 'custom', label: 'Custom' },
    { value: 'streaming', label: 'Streaming Optimized' },
    { value: 'radio', label: 'Radio Ready' },
    { value: 'vinyl', label: 'Vinyl Master' },
    { value: 'cd', label: 'CD Master' },
    { value: 'loud', label: 'Loud & Punchy' },
    { value: 'dynamic', label: 'Dynamic & Natural' },
  ];

  const applyPreset = (preset: string) => {
    const presetSettings = {
      streaming: {
        loudness: -14,
        dynamicRange: 8,
        compression: 40,
        limiting: 80,
        stereoEnhancement: true,
      },
      radio: {
        loudness: -12,
        dynamicRange: 6,
        compression: 60,
        limiting: 90,
        stereoEnhancement: true,
      },
      vinyl: {
        loudness: -18,
        dynamicRange: 12,
        compression: 20,
        limiting: 50,
        vintage: true,
      },
      cd: {
        loudness: -16,
        dynamicRange: 10,
        compression: 35,
        limiting: 75,
        multiband: true,
      },
      loud: {
        loudness: -10,
        dynamicRange: 4,
        compression: 70,
        limiting: 95,
        saturation: 25,
      },
      dynamic: {
        loudness: -20,
        dynamicRange: 15,
        compression: 15,
        limiting: 40,
        vintage: true,
      },
    };

    if (preset !== 'custom' && presetSettings[preset as keyof typeof presetSettings]) {
      setSettings(prev => ({
        ...prev,
        ...presetSettings[preset as keyof typeof presetSettings],
      }));
    }
  };

  const handleMaster = async () => {
    setIsProcessing(true);
    try {
      for (let i = 0; i <= 100; i += 5) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      // Here you would make the actual API call to master the audio
    } catch (error) {
      console.error('Mastering failed:', error);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const resetSettings = () => {
    setSettings({
      loudness: -14,
      dynamicRange: 8,
      stereoWidth: 100,
      lowEndTightness: 50,
      highEndBrightness: 50,
      midPresence: 50,
      compression: 30,
      limiting: 70,
      saturation: 15,
      stereoEnhancement: true,
      multiband: false,
      vintage: false,
    });
    setSelectedPreset('custom');
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
          Mastering Suite
        </Typography>
        <Typography variant="h6" color="text.secondary">
          AI-powered mastering with professional presets
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Controls */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              mb: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Master Preset</InputLabel>
                <Select
                  value={selectedPreset}
                  label="Master Preset"
                  onChange={(e) => {
                    setSelectedPreset(e.target.value);
                    applyPreset(e.target.value);
                  }}
                >
                  {presets.map((preset) => (
                    <MenuItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<RotateCcw size={16} />}
                onClick={resetSettings}
                size="small"
              >
                Reset
              </Button>

              <Box sx={{ flex: 1 }} />

              <Button
                variant="contained"
                startIcon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
                onClick={() => setIsPlaying(!isPlaying)}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              >
                {isPlaying ? 'Pause' : 'Preview'}
              </Button>
            </Stack>

            <Grid container spacing={3}>
              {/* Loudness & Dynamics */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Volume2 size={20} style={{ marginRight: 8 }} />
                  Loudness & Dynamics
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Target Loudness: {settings.loudness} LUFS
                    </Typography>
                    <Slider
                      value={settings.loudness}
                      onChange={(_, value) => setSettings(prev => ({ ...prev, loudness: value as number }))}
                      min={-30}
                      max={-6}
                      step={1}
                      marks={[
                        { value: -23, label: 'Broadcast' },
                        { value: -14, label: 'Streaming' },
                        { value: -8, label: 'Loud' },
                      ]}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Dynamic Range: {settings.dynamicRange} dB LU
                    </Typography>
                    <Slider
                      value={settings.dynamicRange}
                      onChange={(_, value) => setSettings(prev => ({ ...prev, dynamicRange: value as number }))}
                      min={2}
                      max={20}
                      step={1}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Compression: {settings.compression}%
                    </Typography>
                    <Slider
                      value={settings.compression}
                      onChange={(_, value) => setSettings(prev => ({ ...prev, compression: value as number }))}
                      min={0}
                      max={100}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Limiting: {settings.limiting}%
                    </Typography>
                    <Slider
                      value={settings.limiting}
                      onChange={(_, value) => setSettings(prev => ({ ...prev, limiting: value as number }))}
                      min={0}
                      max={100}
                    />
                  </Box>
                </Stack>
              </Grid>

              {/* Tonal Balance */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <BarChart2 size={20} style={{ marginRight: 8 }} />
                  Tonal Balance
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Low End Tightness: {settings.lowEndTightness}%
                    </Typography>
                    <Slider
                      value={settings.lowEndTightness}
                      onChange={(_, value) => setSettings(prev => ({ ...prev, lowEndTightness: value as number }))}
                      min={0}
                      max={100}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Mid Presence: {settings.midPresence}%
                    </Typography>
                    <Slider
                      value={settings.midPresence}
                      onChange={(_, value) => setSettings(prev => ({ ...prev, midPresence: value as number }))}
                      min={0}
                      max={100}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      High End Brightness: {settings.highEndBrightness}%
                    </Typography>
                    <Slider
                      value={settings.highEndBrightness}
                      onChange={(_, value) => setSettings(prev => ({ ...prev, highEndBrightness: value as number }))}
                      min={0}
                      max={100}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Stereo Width: {settings.stereoWidth}%
                    </Typography>
                    <Slider
                      value={settings.stereoWidth}
                      onChange={(_, value) => setSettings(prev => ({ ...prev, stereoWidth: value as number }))}
                      min={0}
                      max={150}
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Enhancement Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Sparkles size={20} style={{ marginRight: 8 }} />
                Enhancement Options
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.stereoEnhancement}
                        onChange={(e) => setSettings(prev => ({ ...prev, stereoEnhancement: e.target.checked }))}
                      />
                    }
                    label="Stereo Enhancement"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.multiband}
                        onChange={(e) => setSettings(prev => ({ ...prev, multiband: e.target.checked }))}
                      />
                    }
                    label="Multiband Processing"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.vintage}
                        onChange={(e) => setSettings(prev => ({ ...prev, vintage: e.target.checked }))}
                      />
                    }
                    label="Vintage Warmth"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Harmonic Saturation: {settings.saturation}%
              </Typography>
              <Slider
                value={settings.saturation}
                onChange={(_, value) => setSettings(prev => ({ ...prev, saturation: value as number }))}
                min={0}
                max={50}
                sx={{ mb: 3 }}
              />
            </Box>

            {isProcessing && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Mastering in progress... {processingProgress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={processingProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            )}

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Target size={20} />}
                onClick={handleMaster}
                disabled={isProcessing}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              >
                {isProcessing ? 'Processing...' : 'Master Audio'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Zap size={20} />}
                disabled={isProcessing}
              >
                AI Auto-Master
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Download size={20} />}
              >
                Export Master
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Analysis & Info */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Analysis
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Current Settings
                </Typography>
                <Stack spacing={1}>
                  <Chip
                    icon={<Volume2 size={14} />}
                    label={`${settings.loudness} LUFS`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<TrendingUp size={14} />}
                    label={`${settings.dynamicRange} dB DR`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Settings size={14} />}
                    label={`${settings.compression}% Compression`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Quality Metrics
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Streaming Readiness
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#10b981',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Dynamic Range
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={70}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#f59e0b',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Frequency Balance
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={92}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#10b981',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              AI Recommendations
            </Typography>
            <Stack spacing={2}>
              <Alert severity="info" sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                Consider reducing compression for better dynamics.
              </Alert>
              <Alert severity="success" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                Perfect loudness level for streaming platforms.
              </Alert>
              <Alert severity="warning" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                High-end might be too bright for vinyl release.
              </Alert>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Mastering;