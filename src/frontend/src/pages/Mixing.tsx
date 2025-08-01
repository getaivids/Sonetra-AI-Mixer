import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Slider,
  Stack,
  IconButton,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Equalizer,
  Filter,
  Waves,
  Zap,
  Music,
  Save,
  Download,
} from 'lucide-react';

interface Track {
  id: string;
  name: string;
  color: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  eq: {
    low: number;
    mid: number;
    high: number;
  };
  effects: {
    reverb: number;
    delay: number;
    compression: number;
  };
}

const Mixing = () => {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'Drums',
      color: '#ef4444',
      volume: 75,
      pan: 0,
      muted: false,
      solo: false,
      eq: { low: 0, mid: 0, high: 0 },
      effects: { reverb: 0, delay: 0, compression: 30 },
    },
    {
      id: '2',
      name: 'Bass',
      color: '#8b5cf6',
      volume: 65,
      pan: -10,
      muted: false,
      solo: false,
      eq: { low: 5, mid: -2, high: -5 },
      effects: { reverb: 10, delay: 0, compression: 50 },
    },
    {
      id: '3',
      name: 'Guitar',
      color: '#10b981',
      volume: 70,
      pan: 25,
      muted: false,
      solo: false,
      eq: { low: -3, mid: 3, high: 2 },
      effects: { reverb: 25, delay: 15, compression: 20 },
    },
    {
      id: '4',
      name: 'Vocals',
      color: '#f59e0b',
      volume: 80,
      pan: 0,
      muted: false,
      solo: false,
      eq: { low: -5, mid: 2, high: 8 },
      effects: { reverb: 35, delay: 20, compression: 40 },
    },
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(85);
  const [selectedTrack, setSelectedTrack] = useState<string>('1');

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(prev => prev.map(track => 
      track.id === id ? { ...track, ...updates } : track
    ));
  };

  const resetTrack = (id: string) => {
    updateTrack(id, {
      volume: 75,
      pan: 0,
      eq: { low: 0, mid: 0, high: 0 },
      effects: { reverb: 0, delay: 0, compression: 0 },
    });
  };

  const currentTrack = tracks.find(t => t.id === selectedTrack);

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
          Mixing Console
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Professional mixing tools with AI assistance
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Track Mixer */}
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
              <IconButton
                onClick={() => setIsPlaying(!isPlaying)}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </IconButton>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Master Volume
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <VolumeX size={16} />
                  <Slider
                    value={masterVolume}
                    onChange={(_, value) => setMasterVolume(value as number)}
                    sx={{ flex: 1 }}
                  />
                  <Volume2 size={16} />
                  <Typography variant="caption" sx={{ minWidth: 40 }}>
                    {masterVolume}%
                  </Typography>
                </Stack>
              </Box>

              <Button
                variant="outlined"
                startIcon={<Save size={16} />}
                size="small"
              >
                Save Mix
              </Button>
            </Stack>

            <Grid container spacing={2}>
              {tracks.map((track, index) => (
                <Grid item xs={12} sm={6} md={3} key={track.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: selectedTrack === track.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(37, 37, 69, 0.8)',
                        border: selectedTrack === track.id 
                          ? '2px solid rgba(99, 102, 241, 0.5)' 
                          : '1px solid rgba(99, 102, 241, 0.1)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedTrack(track.id)}
                    >
                      <Stack spacing={2}>
                        {/* Track Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: track.color,
                              }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {track.name}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              resetTrack(track.id);
                            }}
                          >
                            <RotateCcw size={14} />
                          </IconButton>
                        </Box>

                        {/* Volume Fader */}
                        <Box sx={{ height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                            {track.volume}
                          </Typography>
                          <Slider
                            orientation="vertical"
                            value={track.volume}
                            onChange={(_, value) => updateTrack(track.id, { volume: value as number })}
                            sx={{ 
                              height: 80,
                              '& .MuiSlider-thumb': {
                                backgroundColor: track.color,
                              },
                              '& .MuiSlider-track': {
                                backgroundColor: track.color,
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            Vol
                          </Typography>
                        </Box>

                        {/* Pan Control */}
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Pan: {track.pan > 0 ? 'R' : track.pan < 0 ? 'L' : 'C'}{Math.abs(track.pan)}
                          </Typography>
                          <Slider
                            value={track.pan}
                            onChange={(_, value) => updateTrack(track.id, { pan: value as number })}
                            min={-50}
                            max={50}
                            size="small"
                          />
                        </Box>

                        {/* Mute/Solo */}
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant={track.muted ? "contained" : "outlined"}
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTrack(track.id, { muted: !track.muted });
                            }}
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            M
                          </Button>
                          <Button
                            size="small"
                            variant={track.solo ? "contained" : "outlined"}
                            color="warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTrack(track.id, { solo: !track.solo });
                            }}
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            S
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Track Details & Effects */}
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
              Track Details
            </Typography>
            
            {currentTrack && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Selected Track
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: currentTrack.color,
                      }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {currentTrack.name}
                    </Typography>
                  </Stack>
                </Box>

                <Divider />

                {/* EQ Section */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Equalizer size={16} style={{ marginRight: 8 }} />
                    EQ Controls
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Low: {currentTrack.eq.low > 0 ? '+' : ''}{currentTrack.eq.low}dB
                      </Typography>
                      <Slider
                        value={currentTrack.eq.low}
                        onChange={(_, value) => updateTrack(currentTrack.id, {
                          eq: { ...currentTrack.eq, low: value as number }
                        })}
                        min={-12}
                        max={12}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Mid: {currentTrack.eq.mid > 0 ? '+' : ''}{currentTrack.eq.mid}dB
                      </Typography>
                      <Slider
                        value={currentTrack.eq.mid}
                        onChange={(_, value) => updateTrack(currentTrack.id, {
                          eq: { ...currentTrack.eq, mid: value as number }
                        })}
                        min={-12}
                        max={12}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        High: {currentTrack.eq.high > 0 ? '+' : ''}{currentTrack.eq.high}dB
                      </Typography>
                      <Slider
                        value={currentTrack.eq.high}
                        onChange={(_, value) => updateTrack(currentTrack.id, {
                          eq: { ...currentTrack.eq, high: value as number }
                        })}
                        min={-12}
                        max={12}
                        size="small"
                      />
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Effects Section */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Zap size={16} style={{ marginRight: 8 }} />
                    Effects
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Reverb: {currentTrack.effects.reverb}%
                      </Typography>
                      <Slider
                        value={currentTrack.effects.reverb}
                        onChange={(_, value) => updateTrack(currentTrack.id, {
                          effects: { ...currentTrack.effects, reverb: value as number }
                        })}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Delay: {currentTrack.effects.delay}%
                      </Typography>
                      <Slider
                        value={currentTrack.effects.delay}
                        onChange={(_, value) => updateTrack(currentTrack.id, {
                          effects: { ...currentTrack.effects, delay: value as number }
                        })}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Compression: {currentTrack.effects.compression}%
                      </Typography>
                      <Slider
                        value={currentTrack.effects.compression}
                        onChange={(_, value) => updateTrack(currentTrack.id, {
                          effects: { ...currentTrack.effects, compression: value as number }
                        })}
                        size="small"
                      />
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Waves size={20} />}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    }}
                  >
                    AI Mix Suggestions
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Download size={20} />}
                  >
                    Export Mix
                  </Button>
                </Stack>
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Mixing;