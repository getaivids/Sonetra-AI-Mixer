from typing import Optional, Union, Tuple
import numpy as np
import librosa
import random
from scipy import signal

class AudioAugmenter:
    """Audio augmentation for training data"""
    
    def __init__(
        self,
        pitch_shift_range: Tuple[int, int] = (-2, 2),
        time_stretch_range: Tuple[float, float] = (0.9, 1.1),
        noise_factor_range: Tuple[float, float] = (0.001, 0.005),
        eq_gain_range: Tuple[float, float] = (-6.0, 6.0)
    ):
        self.pitch_shift_range = pitch_shift_range
        self.time_stretch_range = time_stretch_range
        self.noise_factor_range = noise_factor_range
        self.eq_gain_range = eq_gain_range
    
    def __call__(
        self,
        audio: np.ndarray,
        sr: int = 22050
    ) -> np.ndarray:
        """Apply random augmentations to audio"""
        # Randomly select augmentations
        augmentations = [
            self.pitch_shift,
            self.time_stretch,
            self.add_noise,
            self.apply_eq
        ]
        
        # Apply 1-3 random augmentations
        num_augs = random.randint(1, 3)
        selected_augs = random.sample(augmentations, num_augs)
        
        # Apply augmentations
        augmented = audio.copy()
        for aug in selected_augs:
            augmented = aug(augmented, sr)
        
        return augmented
    
    def pitch_shift(
        self,
        audio: np.ndarray,
        sr: int
    ) -> np.ndarray:
        """Apply random pitch shift"""
        n_steps = random.uniform(
            self.pitch_shift_range[0],
            self.pitch_shift_range[1]
        )
        return librosa.effects.pitch_shift(
            audio,
            sr=sr,
            n_steps=n_steps
        )
    
    def time_stretch(
        self,
        audio: np.ndarray,
        sr: int
    ) -> np.ndarray:
        """Apply random time stretching"""
        rate = random.uniform(
            self.time_stretch_range[0],
            self.time_stretch_range[1]
        )
        return librosa.effects.time_stretch(audio, rate=rate)
    
    def add_noise(
        self,
        audio: np.ndarray,
        sr: int
    ) -> np.ndarray:
        """Add random noise"""
        noise_factor = random.uniform(
            self.noise_factor_range[0],
            self.noise_factor_range[1]
        )
        noise = np.random.randn(len(audio))
        return audio + noise_factor * noise
    
    def apply_eq(
        self,
        audio: np.ndarray,
        sr: int
    ) -> np.ndarray:
        """Apply random EQ"""
        # Create random EQ curve
        num_bands = 8
        frequencies = np.logspace(1, 4, num_bands)
        gains = np.random.uniform(
            self.eq_gain_range[0],
            self.eq_gain_range[1],
            num_bands
        )
        
        # Apply EQ
        eq_audio = audio.copy()
        for freq, gain in zip(frequencies, gains):
            # Create bandpass filter
            b, a = signal.butter(
                2,
                [freq - freq/2, freq + freq/2],
                btype='band',
                fs=sr
            )
            
            # Apply filter with gain
            filtered = signal.filtfilt(b, a, audio)
            eq_audio += filtered * (10 ** (gain/20))
        
        return eq_audio 