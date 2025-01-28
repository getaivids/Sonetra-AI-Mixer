from typing import Dict
import numpy as np
import torch
import torch.nn as nn
from spleeter.separator import Separator
import librosa

class MusicComponentSeparator:
    """
    Separates music into components: vocals, drums, bass, and other instruments
    Using Spleeter for high-quality source separation
    """
    def __init__(self):
        self.separator = Separator('spleeter:4stems')
        self.sample_rate = 44100
    
    async def separate_components(
        self,
        audio: np.ndarray
    ) -> Dict[str, np.ndarray]:
        """
        Separates audio into different components
        
        Args:
            audio (np.ndarray): Input audio
            
        Returns:
            Dict[str, np.ndarray]: Separated components (vocals, drums, bass, other)
        """
        # Ensure correct shape and sample rate
        if len(audio.shape) == 1:
            audio = audio.reshape(1, -1)
        
        # Perform separation
        separated = self.separator.separate(audio)
        
        return {
            'vocals': separated['vocals'],
            'drums': separated['drums'],
            'bass': separated['bass'],
            'other': separated['other']
        }
    
    async def isolate_component(
        self,
        audio: np.ndarray,
        component: str
    ) -> np.ndarray:
        """
        Isolates a specific component from the audio
        
        Args:
            audio (np.ndarray): Input audio
            component (str): Component to isolate ('vocals', 'drums', 'bass', 'other')
            
        Returns:
            np.ndarray: Isolated component
        """
        components = await self.separate_components(audio)
        return components.get(component, None) 