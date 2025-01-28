from typing import Dict, Any
import torch
import torch.nn as nn
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
import librosa
import numpy as np
import torchaudio

class TransitionGenerator:
    """
    Advanced transition generator using AudioCraft's MusicGen
    for high-quality music generation and transition
    """
    def __init__(self):
        self.model = MusicGen.get_pretrained('medium')
        self.model.set_generation_params(
            duration=8,  # Maximum transition duration
            temperature=0.8,
            top_k=250,
            top_p=0.95,
        )
    
    async def generate_transition(
        self,
        track1: torch.Tensor,
        track2: torch.Tensor,
        prompt: str,
        settings: Dict[str, Any]
    ) -> torch.Tensor:
        """
        Generate transition using MusicGen
        
        Args:
            track1: First track segment
            track2: Second track segment
            prompt: Text description of desired transition
            settings: Generation settings
            
        Returns:
            Generated transition audio
        """
        # Create transition prompt
        full_prompt = self._create_transition_prompt(
            track1, track2, prompt)
        
        # Generate transition
        with torch.no_grad():
            transition = self.model.generate(
                descriptions=[full_prompt],
                progress=True
            )
        
        # Post-process transition
        processed = self._post_process_transition(
            transition, track1, track2, settings)
        
        return processed
    
    def _create_transition_prompt(
        self,
        track1: torch.Tensor,
        track2: torch.Tensor,
        base_prompt: str
    ) -> str:
        """Create detailed prompt for transition generation"""
        # Analyze tracks
        track1_features = self._analyze_track_features(track1)
        track2_features = self._analyze_track_features(track2)
        
        # Create prompt
        prompt = f"{base_prompt}, transitioning from "
        prompt += f"{track1_features['style']} at {track1_features['tempo']}bpm "
        prompt += f"to {track2_features['style']} at {track2_features['tempo']}bpm, "
        prompt += f"maintaining musical coherence and energy flow"
        
        return prompt
    
    def _post_process_transition(
        self,
        transition: torch.Tensor,
        track1: torch.Tensor,
        track2: torch.Tensor,
        settings: Dict[str, Any]
    ) -> torch.Tensor:
        """Post-process generated transition"""
        # Adjust length
        target_length = int(settings['transition_length'] * self.sample_rate)
        transition = self._adjust_length(transition, target_length)
        
        # Match volume
        transition = self._match_volume(transition, track1, track2)
        
        # Apply fade curves
        transition = self._apply_fade_curves(transition, settings)
        
        return transition 

    def _analyze_track_features(
        self,
        audio: torch.Tensor
    ) -> Dict[str, Any]:
        """
        Analyze track features for prompt generation
        """
        features = {}
        
        # Convert to numpy for librosa
        audio_np = audio.cpu().numpy().squeeze()
        
        # Detect tempo
        tempo, _ = librosa.beat.beat_track(y=audio_np, sr=self.model.sample_rate)
        features['tempo'] = int(tempo)
        
        # Detect key
        chroma = librosa.feature.chroma_cqt(y=audio_np, sr=self.model.sample_rate)
        key_idx = np.argmax(np.mean(chroma, axis=1))
        keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        features['key'] = keys[key_idx]
        
        # Analyze style characteristics
        spectral_contrast = librosa.feature.spectral_contrast(
            y=audio_np, sr=self.model.sample_rate)
        
        # Determine style based on spectral characteristics
        features['style'] = self._determine_style(
            tempo, spectral_contrast)
        
        return features

    def _determine_style(
        self,
        tempo: float,
        spectral_contrast: np.ndarray
    ) -> str:
        """
        Determine musical style based on audio characteristics
        """
        # Calculate style indicators
        energy = np.mean(spectral_contrast)
        rhythm_intensity = np.std(spectral_contrast)
        
        # Style classification logic
        if tempo > 160:
            if energy > 50:
                return "high-energy electronic"
            else:
                return "upbeat rhythmic"
        elif tempo > 120:
            if energy > 40:
                return "energetic pop"
            else:
                return "moderate groove"
        else:
            if energy > 30:
                return "melodic flow"
            else:
                return "smooth ambient"

    def _adjust_length(
        self,
        audio: torch.Tensor,
        target_length: int
    ) -> torch.Tensor:
        """
        Adjust audio length to match target duration
        """
        current_length = audio.size(-1)
        
        if current_length == target_length:
            return audio
        
        # Time stretching using phase vocoder
        phase_vocoder = torchaudio.transforms.TimeStretch(
            hop_length=512,
            n_freq=2048,
        ).to(audio.device)
        
        stretch_factor = target_length / current_length
        stretched = phase_vocoder(audio.unsqueeze(0), stretch_factor)
        
        # Trim or pad if necessary
        if stretched.size(-1) > target_length:
            return stretched[..., :target_length]
        elif stretched.size(-1) < target_length:
            return torch.nn.functional.pad(
                stretched, (0, target_length - stretched.size(-1)))
        
        return stretched

    def _match_volume(
        self,
        transition: torch.Tensor,
        track1: torch.Tensor,
        track2: torch.Tensor
    ) -> torch.Tensor:
        """
        Match transition volume to surrounding tracks
        """
        # Calculate RMS energy
        rms1 = torch.sqrt(torch.mean(track1**2))
        rms2 = torch.sqrt(torch.mean(track2**2))
        rms_transition = torch.sqrt(torch.mean(transition**2))
        
        # Calculate target RMS (smooth transition between tracks)
        target_rms = torch.linspace(
            rms1, rms2, transition.size(-1))
        
        # Apply volume adjustment
        gain = target_rms / rms_transition
        adjusted = transition * gain.unsqueeze(0)
        
        return adjusted

    def _apply_fade_curves(
        self,
        audio: torch.Tensor,
        settings: Dict[str, Any]
    ) -> torch.Tensor:
        """
        Apply customizable fade curves to transition
        """
        length = audio.size(-1)
        fade_length = int(length * 0.3)  # 30% fade duration
        
        # Create fade curves based on settings
        fade_type = settings.get('fade_type', 'sigmoid')
        
        if fade_type == 'linear':
            fade_in = torch.linspace(0, 1, fade_length)
            fade_out = torch.linspace(1, 0, fade_length)
        elif fade_type == 'sigmoid':
            fade_in = torch.sigmoid(torch.linspace(-6, 6, fade_length))
            fade_out = torch.sigmoid(torch.linspace(6, -6, fade_length))
        else:  # exponential
            fade_in = torch.exp(torch.linspace(-4, 0, fade_length))
            fade_out = torch.exp(torch.linspace(0, -4, fade_length))
        
        # Normalize fade curves
        fade_in = fade_in / fade_in.max()
        fade_out = fade_out / fade_out.max()
        
        # Apply fades
        audio[..., :fade_length] *= fade_in
        audio[..., -fade_length:] *= fade_out
        
        return audio 