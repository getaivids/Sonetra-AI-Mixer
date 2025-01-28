import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import {
    Button,
    CircularProgress,
    Grid,
    Paper,
    Typography,
    Select,
    MenuItem,
    Box,
    Slider,
    IconButton
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    VolumeUp,
    VolumeDown
} from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

interface AudioAnalysis {
    beats: number[];
    key: string;
    scale: string;
    tempo: number;
    energy: number;
    spectral_centroid: number;
}

const WaveformContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '128px',
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2)
}));

const AudioProcessor: React.FC = () => {
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
    const [transitionStyle, setTransitionStyle] = useState('smooth');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);

    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        if (waveformRef.current) {
            wavesurfer.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#4a9eff',
                progressColor: '#1976d2',
                cursorColor: '#1976d2',
                barWidth: 2,
                barRadius: 3,
                responsive: true,
                height: 128,
                normalize: true
            });

            wavesurfer.current.on('play', () => setIsPlaying(true));
            wavesurfer.current.on('pause', () => setIsPlaying(false));

            return () => {
                if (wavesurfer.current) {
                    wavesurfer.current.destroy();
                }
            };
        }
    }, []);

    useEffect(() => {
        if (wavesurfer.current) {
            wavesurfer.current.setVolume(volume);
        }
    }, [volume]);

    const handleFileChange = async (file: File | null, isFirst: boolean) => {
        if (file && wavesurfer.current) {
            const url = URL.createObjectURL(file);
            await wavesurfer.current.load(url);
            
            if (isFirst) {
                setFile1(file);
            } else {
                setFile2(file);
            }
        }
    };

    const togglePlayPause = () => {
        if (wavesurfer.current) {
            wavesurfer.current.playPause();
        }
    };

    const handleVolumeChange = (_: Event, newValue: number | number[]) => {
        setVolume(newValue as number);
    };

    const handleAnalyze = async () => {
        if (!file1) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file1);

            const response = await axios.post<AudioAnalysis>(
                'http://localhost:8000/analyze/track',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setAnalysis(response.data);

            // Visualize beats if wavesurfer is initialized
            if (wavesurfer.current && response.data.beats) {
                response.data.beats.forEach(beat => {
                    wavesurfer.current?.addMarker({
                        time: beat,
                        color: '#ff0000',
                        position: 'top'
                    });
                });
            }
        } catch (err) {
            setError('Failed to analyze audio');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTransition = async () => {
        if (!file1 || !file2) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file1', file1);
            formData.append('file2', file2);
            formData.append('style', transitionStyle);

            const response = await axios.post(
                'http://localhost:8000/transition/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    responseType: 'blob'
                }
            );

            // Load transition into wavesurfer
            const url = URL.createObjectURL(response.data);
            if (wavesurfer.current) {
                await wavesurfer.current.load(url);
            }

            // Also create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = 'transition.wav';
            link.click();
        } catch (err) {
            setError('Failed to create transition');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Audio Analysis & Processing
                    </Typography>

                    <WaveformContainer ref={waveformRef} />

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={togglePlayPause}>
                            {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <VolumeDown />
                        <Slider
                            value={volume}
                            onChange={handleVolumeChange}
                            min={0}
                            max={1}
                            step={0.01}
                            sx={{ mx: 2 }}
                        />
                        <VolumeUp />
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileChange(
                                    e.target.files?.[0] || null,
                                    true
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileChange(
                                    e.target.files?.[0] || null,
                                    false
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ my: 2 }}>
                        <Select
                            value={transitionStyle}
                            onChange={(e) => setTransitionStyle(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="smooth">Smooth</MenuItem>
                            <MenuItem value="sudden">Sudden</MenuItem>
                            <MenuItem value="harmonic">Harmonic</MenuItem>
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleAnalyze}
                            disabled={!file1 || loading}
                        >
                            Analyze Track
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleCreateTransition}
                            disabled={!file1 || !file2 || loading}
                        >
                            Create Transition
                        </Button>
                    </Box>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    
                    {error && (
                        <Typography color="error" sx={{ my: 2 }}>
                            {error}
                        </Typography>
                    )}

                    {analysis && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">Analysis Results</Typography>
                            <Typography>Key: {analysis.key} {analysis.scale}</Typography>
                            <Typography>Tempo: {analysis.tempo.toFixed(1)} BPM</Typography>
                            <Typography>Energy: {analysis.energy.toFixed(2)}</Typography>
                            <Typography>
                                Spectral Centroid: {analysis.spectral_centroid.toFixed(2)} Hz
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AudioProcessor; 