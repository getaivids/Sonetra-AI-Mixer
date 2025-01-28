from typing import Tuple, List
import numpy as np
import torch
import torch.nn as nn
import librosa
from scipy.signal import find_peaks

class BeatDetector:
    """
    Advanced beat detection using multiple analysis methods
    and deep learning for accurate beat tracking
    """
    def __init__(self):
        self.model = self._load_beat_detection_model()
        self.sample_rate = 22050
    
    async def detect_beats(
        self,
        audio: np.ndarray
    ) -> np.ndarray:
        """
        Detect beat positions using multiple methods
        
        Args:
            audio (np.ndarray): Input audio signal
            
        Returns:
            np.ndarray: Array of beat positions in samples
        """
        # Get beats from different methods
        librosa_beats = self._detect_beats_librosa(audio)
        energy_beats = self._detect_beats_energy(audio)
        ml_beats = await self._detect_beats_ml(audio)
        
        # Combine and refine beats
        combined_beats = self._combine_beat_detections(
            librosa_beats, energy_beats, ml_beats)
        
        # Post-process beats
        refined_beats = self._refine_beats(combined_beats, audio)
        
        return refined_beats
    
    def _detect_beats_librosa(
        self,
        audio: np.ndarray
    ) -> np.ndarray:
        """
        Detect beats using librosa's beat tracker
        """
        tempo, beats = librosa.beat.beat_track(
            y=audio,
            sr=self.sample_rate,
            units='samples'
        )
        return beats
    
    def _detect_beats_energy(
        self,
        audio: np.ndarray
    ) -> np.ndarray:
        """
        Detect beats using onset strength signal
        """
        # Calculate onset strength
        onset_env = librosa.onset.onset_strength(
            y=audio, sr=self.sample_rate)
        
        # Find peaks in onset strength
        peaks, _ = find_peaks(
            onset_env,
            distance=20,
            prominence=0.5
        )
        
        # Convert to samples
        return peaks * self.sample_rate // len(onset_env)
    
    async def _detect_beats_ml(
        self,
        audio: np.ndarray
    ) -> np.ndarray:
        """
        Detect beats using deep learning model
        """
        # Convert to tensor
        audio_tensor = torch.FloatTensor(audio).unsqueeze(0)
        
        # Get model predictions
        with torch.no_grad():
            beat_predictions = self.model(audio_tensor)
        
        # Convert predictions to beat positions
        beats = self._predictions_to_beats(beat_predictions)
        
        return beats
    
    def _combine_beat_detections(
        self,
        beats1: np.ndarray,
        beats2: np.ndarray,
        beats3: np.ndarray
    ) -> np.ndarray:
        """
        Combine beats from multiple detection methods
        """
        # Collect all beat candidates
        all_beats = np.concatenate([beats1, beats2, beats3])
        
        # Cluster close beats
        clusters = self._cluster_beats(all_beats, threshold_ms=30)
        
        # Select most confident beat from each cluster
        final_beats = np.array([
            self._select_best_beat(cluster)
            for cluster in clusters
        ])
        
        return np.sort(final_beats)
    
    def _refine_beats(
        self,
        beats: np.ndarray,
        audio: np.ndarray
    ) -> np.ndarray:
        """
        Refine beat positions using local audio features
        """
        refined_beats = []
        window_size = 1024
        
        for beat in beats:
            # Extract window around beat
            start = max(0, beat - window_size // 2)
            end = min(len(audio), beat + window_size // 2)
            window = audio[start:end]
            
            if len(window) < window_size:
                continue
            
            # Find local energy peak
            energy = librosa.feature.rms(
                y=window,
                frame_length=512,
                hop_length=128
            )
            peak_offset = np.argmax(energy)
            
            # Adjust beat position
            refined_beat = beat + (peak_offset * 128 - window_size // 2)
            refined_beats.append(refined_beat)
        
        return np.array(refined_beats)
    
    def _cluster_beats(
        self,
        beats: np.ndarray,
        threshold_ms: float
    ) -> List[np.ndarray]:
        """
        Cluster beats that are close together
        """
        if len(beats) == 0:
            return []
        
        # Convert threshold to samples
        threshold = int(threshold_ms * self.sample_rate / 1000)
        
        # Sort beats
        sorted_beats = np.sort(beats)
        
        # Initialize clusters
        clusters = [[sorted_beats[0]]]
        
        # Cluster beats
        for beat in sorted_beats[1:]:
            if beat - clusters[-1][-1] < threshold:
                clusters[-1].append(beat)
            else:
                clusters.append([beat])
        
        return [np.array(cluster) for cluster in clusters]
    
    def _select_best_beat(
        self,
        cluster: np.ndarray
    ) -> int:
        """
        Select the best beat from a cluster
        """
        # For now, simply take the median
        return int(np.median(cluster))
    
    def _load_beat_detection_model(self) -> nn.Module:
        """
        Load deep learning model for beat detection
        """
        model = nn.Sequential(
            nn.Conv1d(1, 16, 15, padding=7),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Conv1d(16, 32, 15, padding=7),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Conv1d(32, 64, 15, padding=7),
            nn.ReLU(),
            nn.Conv1d(64, 1, 15, padding=7),
            nn.Sigmoid()
        )
        
        # TODO: Load pretrained weights
        return model
    
    def _predictions_to_beats(
        self,
        predictions: torch.Tensor
    ) -> np.ndarray:
        """
        Convert model predictions to beat positions
        """
        # Convert to numpy
        pred_np = predictions.squeeze().numpy()
        
        # Find peaks in predictions
        peaks, _ = find_peaks(
            pred_np,
            height=0.5,
            distance=20
        )
        
        # Convert to sample positions
        return peaks * self.sample_rate // len(pred_np) 