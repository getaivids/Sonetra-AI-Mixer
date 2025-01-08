import os
from typing import Dict, Any
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

class SpotifyClient:
    """Handles all Spotify API interactions"""
    
    def __init__(self):
        load_dotenv()
        client_id = os.getenv('SPOTIFY_CLIENT_ID')
        client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        
        if not client_id or not client_secret:
            raise ValueError("Spotify credentials not found in .env file")
            
        self.sp = spotipy.Spotify(
            client_credentials_manager=SpotifyClientCredentials(
                client_id=client_id,
                client_secret=client_secret
            )
        )
    
    def get_track_info(self, track_url: str) -> Dict[str, Any]:
        """Get track information from Spotify"""
        track_id = self._extract_track_id(track_url)
        
        track_info = self.sp.track(track_id)
        track_features = self.sp.audio_features(track_id)[0]
        track_analysis = self.sp.audio_analysis(track_id)
        
        return {
            'name': track_info['name'],
            'artist': track_info['artists'][0]['name'],
            'duration_ms': track_info['duration_ms'],
            'features': track_features,
            'analysis': track_analysis
        }
    
    @staticmethod
    def _extract_track_id(track_url: str) -> str:
        """Extract track ID from Spotify URL"""
        return track_url.split('/')[-1].split('?')[0]
