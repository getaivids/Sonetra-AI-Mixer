from typing import Tuple
import numpy as np
import torch
import torch.nn as nn
import librosa

class GenreClassifier:
    """
    Neural network based genre classifier using mel-spectrograms
    """
    def __init__(self):
        self.model = self._load_model()
        self.genres = ['rock', 'pop', 'hip-hop', 'jazz', 'classical', 
                      'electronic', 'metal', 'folk', 'r&b', 'reggae']
    
    async def classify(self, audio: np.ndarray) -> Tuple[str, float]:
        """
        Classifies the genre of an audio track.
        
        Args:
            audio (np.ndarray): Audio signal data
            
        Returns:
            Tuple[str, float]: Predicted genre and confidence score
        """
        mel_spec = self._extract_features(audio)
        prediction = await self._predict(mel_spec)
        genre_idx = torch.argmax(prediction).item()
        confidence = torch.max(torch.softmax(prediction, dim=1)).item()
        
        return self.genres[genre_idx], confidence
    
    def _extract_features(self, audio: np.ndarray) -> torch.Tensor:
        """Extract mel-spectrogram features from audio"""
        mel_spec = librosa.feature.melspectrogram(
            y=audio,
            sr=22050,
            n_mels=128,
            fmax=8000
        )
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        return torch.FloatTensor(mel_spec_db).unsqueeze(0)
    
    def _load_model(self) -> nn.Module:
        """Load pretrained genre classification model"""
        model = nn.Sequential(
            nn.Conv2d(1, 32, 3),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(64 * 30 * 30, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, len(self.genres))
        )
        # TODO: Load pretrained weights
        return model 