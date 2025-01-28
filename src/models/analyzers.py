import numpy as np
import librosa
from typing import Dict, Any, Tuple
import torch
import torch.nn as nn

class StyleAnalyzer:
    """
    Analyzes musical style characteristics of audio tracks
    """
    async def compare_styles(
        self,
        track1: np.ndarray,
        track2: np.ndarray
    ) -> float:
        """
        Compares musical styles between two tracks
        
        Args:
            track1 (np.ndarray): First audio track
            track2 (np.ndarray): Second audio track
            
        Returns:
            float: Style similarity score (0-1)
        """
        features1 = await self._extract_style_features(track1)
        features2 = await self._extract_style_features(track2)
        
        return self._calculate_similarity(features1, features2)
    
    async def _extract_style_features(
        self,
        audio: np.ndarray
    ) -> Dict[str, float]:
        """Extract style-related features from audio"""
        features = {}
        
        # Rhythm features
        tempo, _ = librosa.beat.beat_track(y=audio)
        features['tempo'] = tempo
        
        # Spectral features
        spectral_centroid = librosa.feature.spectral_centroid(y=audio)
        features['spectral_centroid'] = np.mean(spectral_centroid)
        
        # Energy features
        features['rms_energy'] = np.mean(librosa.feature.rms(y=audio))
        
        return features

class HarmonyDetector:
    """
    Analyzes harmonic compatibility between tracks
    """
    async def analyze(
        self,
        track1: np.ndarray,
        track2: np.ndarray
    ) -> float:
        """
        Analyzes harmonic compatibility between two tracks
        
        Args:
            track1 (np.ndarray): First audio track
            track2 (np.ndarray): Second audio track
            
        Returns:
            float: Harmony compatibility score (0-1)
        """
        key1, scale1 = self._detect_key(track1)
        key2, scale2 = self._detect_key(track2)
        
        return self._calculate_harmony_compatibility(
            key1, scale1, key2, scale2)
    
    def _detect_key(self, audio: np.ndarray) -> Tuple[str, str]:
        """Detect musical key and scale"""
        chroma = librosa.feature.chroma_cqt(y=audio)
        key_idx = np.argmax(np.mean(chroma, axis=1))
        keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 
                'F#', 'G', 'G#', 'A', 'A#', 'B']
        
        # Simple major/minor detection
        major_profile = self._get_major_profile()
        minor_profile = self._get_minor_profile()
        
        correlation_major = np.correlate(
            chroma.mean(axis=1), major_profile)
        correlation_minor = np.correlate(
            chroma.mean(axis=1), minor_profile)
        
        scale = 'major' if correlation_major > correlation_minor else 'minor'
        
        return keys[key_idx], scale 

class KeyAnalyzer:
    """
    Advanced musical key analysis using multiple detection methods
    and deep learning for accurate key estimation
    """
    def __init__(self):
        self.key_profiles = self._load_key_profiles()
        self.model = self._load_key_detection_model()
    
    async def analyze(
        self,
        audio: np.ndarray
    ) -> Tuple[str, str]:
        """
        Analyze musical key of audio
        
        Args:
            audio (np.ndarray): Input audio signal
            
        Returns:
            Tuple[str, str]: (key, scale) e.g., ('C', 'major')
        """
        # Get key predictions from different methods
        profile_key = self._analyze_key_profiles(audio)
        ml_key = await self._analyze_ml(audio)
        
        # Combine predictions
        final_key = self._combine_predictions(profile_key, ml_key)
        
        return final_key
    
    def _analyze_key_profiles(
        self,
        audio: np.ndarray
    ) -> Tuple[str, str]:
        """
        Analyze key using Krumhansl-Schmuckler key profiles
        """
        # Calculate chromagram
        chroma = librosa.feature.chroma_cqt(y=audio)
        
        # Calculate key correlations
        correlations = {}
        for key, profile in self.key_profiles.items():
            correlation = np.correlate(
                chroma.mean(axis=1),
                profile
            )
            correlations[key] = correlation[0]
        
        # Find best matching key
        best_key = max(correlations.items(), key=lambda x: x[1])[0]
        key_name, scale = best_key.split('_')
        
        return key_name, scale
    
    async def _analyze_ml(
        self,
        audio: np.ndarray
    ) -> Tuple[str, str]:
        """
        Analyze key using deep learning model
        """
        # Extract features
        features = self._extract_key_features(audio)
        
        # Get model predictions
        with torch.no_grad():
            predictions = self.model(features)
        
        # Convert predictions to key
        key, scale = self._predictions_to_key(predictions)
        
        return key, scale
    
    def _combine_predictions(
        self,
        profile_key: Tuple[str, str],
        ml_key: Tuple[str, str]
    ) -> Tuple[str, str]:
        """
        Combine key predictions from different methods
        """
        # If predictions agree, return that key
        if profile_key == ml_key:
            return profile_key
        
        # Otherwise, use profile-based prediction
        # (more reliable for classical and traditional music)
        return profile_key
    
    def _load_key_profiles(self) -> Dict[str, np.ndarray]:
        """
        Load Krumhansl-Schmuckler key profiles
        """
        profiles = {}
        
        # Major profile
        major_profile = np.array([
            6.35, 2.23, 3.48, 2.33, 4.38, 4.09,
            2.52, 5.19, 2.39, 3.66, 2.29, 2.88
        ])
        
        # Minor profile
        minor_profile = np.array([
            6.33, 2.68, 3.52, 5.38, 2.60, 3.53,
            2.54, 4.75, 3.98, 2.69, 3.34, 3.17
        ])
        
        # Create profiles for all keys
        keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 
                'F#', 'G', 'G#', 'A', 'A#', 'B']
        
        for i, key in enumerate(keys):
            # Shift profiles for each key
            major_shifted = np.roll(major_profile, i)
            minor_shifted = np.roll(minor_profile, i)
            
            profiles[f"{key}_major"] = major_shifted
            profiles[f"{key}_minor"] = minor_shifted
        
        return profiles
    
    def _extract_key_features(
        self,
        audio: np.ndarray
    ) -> torch.Tensor:
        """
        Extract features for key detection model
        """
        # Calculate chromagram
        chroma = librosa.feature.chroma_cqt(y=audio)
        
        # Calculate additional features
        tonnetz = librosa.feature.tonnetz(
            y=audio,
            chroma=chroma
        )
        
        # Combine features
        features = np.concatenate([chroma, tonnetz])
        
        return torch.FloatTensor(features).unsqueeze(0)
    
    def _predictions_to_key(
        self,
        predictions: torch.Tensor
    ) -> Tuple[str, str]:
        """
        Convert model predictions to key and scale
        """
        # Get key and scale indices
        pred_np = predictions.squeeze().numpy()
        key_idx = pred_np[:12].argmax()
        scale_idx = pred_np[12:].argmax()
        
        # Convert to key and scale names
        keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 
                'F#', 'G', 'G#', 'A', 'A#', 'B']
        scales = ['major', 'minor']
        
        return keys[key_idx], scales[scale_idx]
    
    def _load_key_detection_model(self) -> nn.Module:
        """
        Load deep learning model for key detection
        """
        model = nn.Sequential(
            # Input: 12 chroma + 6 tonnetz = 18 features
            nn.Conv1d(18, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Conv1d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Flatten(),
            nn.Linear(64 * 64, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            # Output: 12 keys + 2 scales = 14 classes
            nn.Linear(256, 14)
        )
        
        # TODO: Load pretrained weights
        return model 