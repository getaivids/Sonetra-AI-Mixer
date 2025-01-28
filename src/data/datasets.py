from typing import Dict, List, Optional, Tuple
import torch
from torch.utils.data import Dataset
import numpy as np
import librosa
from pathlib import Path
import json
from .augmentation import AudioAugmenter

class BeatDetectionDataset(Dataset):
    """Dataset for beat detection training"""
    
    def __init__(
        self,
        audio_dir: str,
        annotation_file: str,
        sample_rate: int = 22050,
        segment_length: int = 65536,
        augment: bool = True
    ):
        self.audio_dir = Path(audio_dir)
        self.sample_rate = sample_rate
        self.segment_length = segment_length
        self.augment = augment
        
        # Load annotations
        with open(annotation_file, 'r') as f:
            self.annotations = json.load(f)
        
        # Setup augmentation
        if augment:
            self.augmenter = AudioAugmenter()
    
    def __len__(self) -> int:
        return len(self.annotations)
    
    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        # Load audio and annotations
        item = self.annotations[idx]
        audio_path = self.audio_dir / item['audio_file']
        
        # Load audio
        audio, _ = librosa.load(
            audio_path,
            sr=self.sample_rate,
            duration=self.segment_length / self.sample_rate
        )
        
        # Pad if necessary
        if len(audio) < self.segment_length:
            audio = np.pad(
                audio,
                (0, self.segment_length - len(audio))
            )
        
        # Convert beat times to binary sequence
        beat_sequence = self._times_to_sequence(
            item['beat_times'],
            self.segment_length
        )
        
        # Apply augmentation
        if self.augment:
            audio = self.augmenter(audio)
        
        # Convert to tensor
        audio_tensor = torch.FloatTensor(audio)
        beat_tensor = torch.FloatTensor(beat_sequence)
        
        return {
            'audio': audio_tensor,
            'beats': beat_tensor
        }
    
    def _times_to_sequence(
        self,
        beat_times: List[float],
        length: int
    ) -> np.ndarray:
        """Convert beat times to binary sequence"""
        sequence = np.zeros(length)
        for time in beat_times:
            # Convert time to sample index
            idx = int(time * self.sample_rate)
            if idx < length:
                sequence[idx] = 1
        return sequence


class KeyDetectionDataset(Dataset):
    """Dataset for musical key detection"""
    
    def __init__(
        self,
        audio_dir: str,
        annotation_file: str,
        sample_rate: int = 22050,
        segment_length: int = 65536,
        augment: bool = True
    ):
        self.audio_dir = Path(audio_dir)
        self.sample_rate = sample_rate
        self.segment_length = segment_length
        self.augment = augment
        
        # Load annotations
        with open(annotation_file, 'r') as f:
            self.annotations = json.load(f)
        
        # Setup key mapping
        self.key_to_idx = {
            key: idx for idx, key in enumerate([
                'C', 'C#', 'D', 'D#', 'E', 'F',
                'F#', 'G', 'G#', 'A', 'A#', 'B'
            ])
        }
        
        self.scale_to_idx = {
            'major': 0,
            'minor': 1
        }
        
        # Setup augmentation
        if augment:
            self.augmenter = AudioAugmenter()
    
    def __len__(self) -> int:
        return len(self.annotations)
    
    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        # Load audio and annotations
        item = self.annotations[idx]
        audio_path = self.audio_dir / item['audio_file']
        
        # Load audio
        audio, _ = librosa.load(
            audio_path,
            sr=self.sample_rate,
            duration=self.segment_length / self.sample_rate
        )
        
        # Extract features
        features = self._extract_features(audio)
        
        # Get labels
        key_label = self.key_to_idx[item['key']]
        scale_label = self.scale_to_idx[item['scale']]
        
        # Convert to tensors
        features_tensor = torch.FloatTensor(features)
        key_tensor = torch.LongTensor([key_label])
        scale_tensor = torch.LongTensor([scale_label])
        
        return {
            'features': features_tensor,
            'key_labels': key_tensor,
            'scale_labels': scale_tensor
        }
    
    def _extract_features(self, audio: np.ndarray) -> np.ndarray:
        """Extract features for key detection"""
        # Calculate chromagram
        chroma = librosa.feature.chroma_cqt(
            y=audio,
            sr=self.sample_rate
        )
        
        # Calculate tonnetz features
        tonnetz = librosa.feature.tonnetz(
            y=audio,
            sr=self.sample_rate
        )
        
        # Combine features
        features = np.concatenate([chroma, tonnetz])
        
        return features 