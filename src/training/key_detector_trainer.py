from typing import Dict
import torch
import torch.nn as nn
from .trainer import ModelTrainer
from models.analyzers import KeyAnalyzer

class KeyDetectorTrainer(ModelTrainer):
    """Trainer for KeyAnalyzer model"""
    
    def _train_step(self, batch: Dict[str, torch.Tensor]) -> float:
        """Custom training step for key detection"""
        self.optimizer.zero_grad()
        
        # Get input features and labels
        features = batch['features'].to(self.device)
        key_labels = batch['key_labels'].to(self.device)
        scale_labels = batch['scale_labels'].to(self.device)
        
        # Forward pass
        predictions = self.model(features)
        
        # Split predictions into key and scale
        key_predictions = predictions[:, :12]  # 12 possible keys
        scale_predictions = predictions[:, 12:]  # major/minor
        
        # Calculate losses
        key_loss = self.criterion(key_predictions, key_labels)
        scale_loss = self.criterion(scale_predictions, scale_labels)
        
        # Combine losses
        total_loss = key_loss + scale_loss
        
        # Backward pass
        total_loss.backward()
        self.optimizer.step()
        
        return total_loss.item()
    
    def _validate(self) -> float:
        """Custom validation for key detection"""
        self.model.eval()
        val_loss = 0.0
        correct_keys = 0
        correct_scales = 0
        total = 0
        
        with torch.no_grad():
            for batch in self.val_loader:
                features = batch['features'].to(self.device)
                key_labels = batch['key_labels'].to(self.device)
                scale_labels = batch['scale_labels'].to(self.device)
                
                predictions = self.model(features)
                key_predictions = predictions[:, :12]
                scale_predictions = predictions[:, 12:]
                
                # Calculate accuracy
                correct_keys += (key_predictions.argmax(1) == key_labels).sum().item()
                correct_scales += (scale_predictions.argmax(1) == scale_labels).sum().item()
                total += key_labels.size(0)
                
                # Calculate loss
                key_loss = self.criterion(key_predictions, key_labels)
                scale_loss = self.criterion(scale_predictions, scale_labels)
                val_loss += (key_loss + scale_loss).item()
        
        # Log accuracies
        if self.use_wandb:
            wandb.log({
                'val_key_accuracy': correct_keys / total,
                'val_scale_accuracy': correct_scales / total
            })
        
        return val_loss / len(self.val_loader) 