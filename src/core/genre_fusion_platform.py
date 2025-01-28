from typing import List, Dict, Any
import numpy as np
from .genre_match_engine import GenreMatchEngine
from .transition_engine import TransitionEngine
from models.processors import NeuralMusicProcessor

class GenreFusionPlatform:
    """
    Main platform class that orchestrates the entire genre fusion process.
    Combines genre matching, transitions, and neural processing.
    """
    
    def __init__(self):
        """
        Initialize the GenreFusionPlatform with all required components.
        """
        self.genre_match_engine = GenreMatchEngine()
        self.transition_engine = TransitionEngine()
        self.neural_processor = NeuralMusicProcessor()
    
    async def process_mix(
        self,
        tracks: List[np.ndarray],
        mix_settings: Dict[str, Any]
    ) -> np.ndarray:
        """
        Main mixing pipeline that processes multiple tracks using
        patent-pending algorithms.

        Args:
            tracks (List[np.ndarray]): List of audio tracks to mix
            mix_settings (Dict[str, Any]): Dictionary of mixing parameters

        Returns:
            np.ndarray: Final mixed audio data
        """
        # Analyze track compatibility
        compatibility_matrix = await self._analyze_tracks_compatibility(tracks)
        
        # Process tracks through neural network
        processed_tracks = await self.neural_processor.process_tracks(
            tracks, mix_settings)
        
        # Create transitions between tracks
        transitions = await self._create_track_transitions(
            processed_tracks, compatibility_matrix, mix_settings)
        
        # Generate final mix
        return await self._generate_final_mix(
            processed_tracks, transitions, mix_settings)
    
    async def _analyze_tracks_compatibility(
        self,
        tracks: List[np.ndarray]
    ) -> np.ndarray:
        """
        Analyzes compatibility between all track pairs.

        Args:
            tracks (List[np.ndarray]): List of audio tracks

        Returns:
            np.ndarray: Compatibility score matrix
        """
        num_tracks = len(tracks)
        compatibility_matrix = np.zeros((num_tracks, num_tracks))
        
        for i in range(num_tracks):
            for j in range(i + 1, num_tracks):
                score, _ = await self.genre_match_engine.analyze_genre_compatibility(
                    tracks[i], tracks[j])
                compatibility_matrix[i, j] = score
                compatibility_matrix[j, i] = score
        
        return compatibility_matrix 