from typing import Dict
import torch
import torch.nn as nn
from .trainer import ModelTrainer
from models.detectors import BeatDetector

class BeatDetectorTrainer(ModelTrainer):
    """Trainer for BeatDetector model"""
    
    def _train_step(self, batch: Dict[str, torch.Tensor]) -> float:
        """Custom training step for beat detection"""
        self.optimizer.zero_grad()
        
        # Get audio and beat annotations
        audio = batch['audio'].to(self.device)
        beat_labels = batch['beats'].to(self.device)
        
        # Forward pass
        beat_predictions = self.model(audio)
        
        # Calculate loss
        loss = self.criterion(beat_predictions, beat_labels)
        
        # Add regularization for temporal consistency
        temporal_loss = self._calculate_temporal_loss(beat_predictions)
        total_loss = loss + 0.1 * temporal_loss
        
        # Backward pass
        total_loss.backward()
        self.optimizer.step()
        
        return total_loss.item()
    
    def _calculate_temporal_loss(
        self,
        predictions: torch.Tensor
    ) -> torch.Tensor:
        """Calculate temporal consistency loss"""
        # Calculate difference between adjacent predictions
        diff = torch.diff(predictions, dim=2)
        
        # Penalize sudden changes
        temporal_loss = torch.mean(torch.abs(diff))
        
        return temporal_loss 