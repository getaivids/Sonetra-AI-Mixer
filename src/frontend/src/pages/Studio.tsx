import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  IconButton,
  Slider,
  Chip,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Play,
  Pause,
  Volume2,
  Download,
  Waveform,
  Music,
  FileAudio,
  Trash2,
  RotateCcw,
  Settings,
} from 'lucide-react';

interface AudioFile {
  id: string;
  file: File;
  name: string;
  size: string;
  duration?: string;
  waveform?: number[];
}

const Studio = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFile, setCurrentFile] = useState<AudioFile | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const audioFile: AudioFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      };
      setAudioFiles((prev) => [...prev, audioFile]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setAudioFiles((prev) => prev.filter((file) => file.id !== id));
    if (currentFile?.id === id) {
      setCurrentFile(null);
      setIsPlaying(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleAnalyze = async () => {
    if (!currentFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate API call with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      // Here you would make the actual API call to analyze the file
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
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
          Studio
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Upload and manage your audio files
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* File Upload Area */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 4,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              mb: 3,
            }}
          >
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'rgba(99, 102, 241, 0.3)',
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                backgroundColor: isDragActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              <input {...getInputProps()} />
              <Upload size={48} color="#6366f1" style={{ marginBottom: 16 }} />
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                {isDragActive ? 'Drop your audio files here' : 'Drag & drop audio files'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Support for MP3, WAV, FLAC, AAC, and OGG formats
              </Typography>
              <Button
                variant="contained"
                startIcon={<Upload size={20} />}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              >
                Choose Files
              </Button>
            </Box>

            {isProcessing && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Processing audio...
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
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
          </Paper>

          {/* File List */}
          {audioFiles.length > 0 && (
            <Paper
              sx={{
                p: 3,
                background: 'rgba(26, 26, 58, 0.6)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Uploaded Files ({audioFiles.length})
              </Typography>
              <Stack spacing={2}>
                {audioFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        borderRadius: 2,
                        backgroundColor: currentFile?.id === file.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.05)',
                        },
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onClick={() => setCurrentFile(file)}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'primary.main' + '20',
                            color: 'primary.main',
                          }}
                        >
                          <FileAudio size={24} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {file.name}
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Chip
                              label={file.size}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                            {file.duration && (
                              <Typography variant="caption" color="text.secondary">
                                {file.duration}
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentFile(file);
                              setIsPlaying(!isPlaying);
                            }}
                          >
                            {isPlaying && currentFile?.id === file.id ? (
                              <Pause size={16} />
                            ) : (
                              <Play size={16} />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Paper>
          )}
        </Grid>

        {/* Control Panel */}
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
              Audio Controls
            </Typography>
            
            {currentFile ? (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Current File
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {currentFile.name}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Volume
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Volume2 size={16} />
                    <Slider
                      value={volume}
                      onChange={(_, newValue) => setVolume(newValue as number)}
                      min={0}
                      max={1}
                      step={0.01}
                      sx={{ flex: 1 }}
                    />
                    <Typography variant="caption">
                      {Math.round(volume * 100)}%
                    </Typography>
                  </Stack>
                </Box>

                <Divider />

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Waveform size={20} />}
                    onClick={handleAnalyze}
                    disabled={isProcessing}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    }}
                  >
                    {isProcessing ? 'Analyzing...' : 'Analyze Track'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Settings size={20} />}
                  >
                    Advanced Settings
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Download size={20} />}
                  >
                    Export Audio
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Music size={48} color="#6b7280" style={{ marginBottom: 16 }} />
                <Typography variant="body2" color="text.secondary">
                  Select an audio file to see controls
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 58, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Tips
            </Typography>
            <Stack spacing={2}>
              <Alert severity="info" sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                Upload high-quality audio files for best AI analysis results.
              </Alert>
              <Alert severity="success" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                Try our AI-powered genre detection and mood analysis.
              </Alert>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Studio;