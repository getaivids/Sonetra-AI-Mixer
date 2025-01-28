import numpy as np
import librosa
import soundfile as sf
from typing import Tuple

class AudioUtils:
    """
    Utility functions for audio processing
    """
    @staticmethod
    def load_audio(
        file_path: str,
        sr: int = 22050
    ) -> Tuple[np.ndarray, int]:
        """
        Load audio file
        
        Args:
            file_path (str): Path to audio file
            sr (int): Target sample rate
            
        Returns:
            Tuple[np.ndarray, int]: Audio data and sample rate
        """
        audio, sr = librosa.load(file_path, sr=sr)
        return audio, sr
    
    @staticmethod
    def save_audio(
        audio: np.ndarray,
        file_path: str,
        sr: int = 22050
    ) -> None:
        """
        Save audio to file
        
        Args:
            audio (np.ndarray): Audio data
            file_path (str): Output file path
            sr (int): Sample rate
        """
        sf.write(file_path, audio, sr)
    
    @staticmethod
    def normalize_audio(audio: np.ndarray) -> np.ndarray:
        """Normalize audio to -1 to 1 range"""
        return librosa.util.normalize(audio)
    
    @staticmethod
    def trim_silence(
        audio: np.ndarray,
        threshold_db: float = -50
    ) -> np.ndarray:
        """Remove silence from audio"""
        return librosa.effects.trim(
            audio, top_db=threshold_db)[0] 