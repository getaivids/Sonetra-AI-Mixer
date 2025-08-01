import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export interface AudioAnalysis {
  beats: number[];
  key: string;
  scale: string;
  tempo: number;
  energy: number;
  spectral_centroid: number;
}

export interface TransitionSettings {
  style: string;
  duration?: number;
  crossfade?: number;
}

export interface StyleTransferSettings {
  target_style: string;
  intensity?: number;
  preserve_vocals?: boolean;
}

// Audio Analysis API
export const analyzeTrack = async (file: File): Promise<AudioAnalysis> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/analyze/track', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Transition Creation API
export const createTransition = async (
  file1: File,
  file2: File,
  settings: TransitionSettings
): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file1', file1);
  formData.append('file2', file2);
  formData.append('style', settings.style);
  
  if (settings.duration) {
    formData.append('duration', settings.duration.toString());
  }

  const response = await api.post('/api/transition/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
  });

  return response.data;
};

// Style Transfer API
export const transferStyle = async (
  file: File,
  settings: StyleTransferSettings
): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_style', settings.target_style);
  
  if (settings.intensity) {
    formData.append('intensity', settings.intensity.toString());
  }

  const response = await api.post('/api/style/transfer', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
  });

  return response.data;
};

// AI Enhancement API (placeholder for future implementation)
export const getAIRecommendations = async (analysis: AudioAnalysis) => {
  // This would be implemented with Gemini/OpenAI integration
  return {
    mixing_suggestions: [
      'Consider adding compression to increase perceived loudness',
      'Try EQ boost around 2-4kHz for more presence',
    ],
    mastering_suggestions: [
      'Use multiband compression for better control',
      'Apply gentle limiting for loudness standards',
    ],
    genre_prediction: 'Electronic',
    mood_analysis: 'Energetic',
    confidence: 0.92,
  };
};

export default api;