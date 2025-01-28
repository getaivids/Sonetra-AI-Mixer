from typing import Dict, Any, Optional
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from pathlib import Path
import wandb
from tqdm import tqdm

class ModelTrainer:
    """Base trainer class for model training"""
    
    def __init__(
        self,
        model: nn.Module,
        train_loader: DataLoader,
        val_loader: DataLoader,
        config: Dict[str, Any],
        device: Optional[str] = None
    ):
        self.model = model
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.config = config
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Setup training
        self.model = self.model.to(self.device)
        self.optimizer = self._setup_optimizer()
        self.scheduler = self._setup_scheduler()
        self.criterion = self._setup_criterion()
        
        # Logging
        self.use_wandb = config.get('use_wandb', False)
        if self.use_wandb:
            wandb.init(project=config['project_name'])
    
    def train(self, epochs: int) -> None:
        """Train model for specified number of epochs"""
        best_val_loss = float('inf')
        
        for epoch in range(epochs):
            # Training phase
            self.model.train()
            train_loss = 0.0
            
            with tqdm(self.train_loader, desc=f'Epoch {epoch+1}/{epochs}') as pbar:
                for batch in pbar:
                    loss = self._train_step(batch)
                    train_loss += loss
                    pbar.set_postfix({'loss': loss})
            
            train_loss /= len(self.train_loader)
            
            # Validation phase
            val_loss = self._validate()
            
            # Logging
            metrics = {
                'train_loss': train_loss,
                'val_loss': val_loss,
                'epoch': epoch
            }
            
            if self.use_wandb:
                wandb.log(metrics)
            
            print(f'Epoch {epoch+1}/{epochs}:')
            print(f'Train Loss: {train_loss:.4f}')
            print(f'Val Loss: {val_loss:.4f}')
            
            # Save best model
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                self._save_checkpoint(
                    epoch, val_loss, is_best=True)
    
    def _train_step(self, batch: Dict[str, torch.Tensor]) -> float:
        """Single training step"""
        self.optimizer.zero_grad()
        
        # Forward pass
        outputs = self.model(batch['input'].to(self.device))
        loss = self.criterion(
            outputs, batch['target'].to(self.device))
        
        # Backward pass
        loss.backward()
        self.optimizer.step()
        
        return loss.item()
    
    def _validate(self) -> float:
        """Validation loop"""
        self.model.eval()
        val_loss = 0.0
        
        with torch.no_grad():
            for batch in self.val_loader:
                outputs = self.model(batch['input'].to(self.device))
                loss = self.criterion(
                    outputs, batch['target'].to(self.device))
                val_loss += loss.item()
        
        return val_loss / len(self.val_loader)
    
    def _save_checkpoint(
        self,
        epoch: int,
        val_loss: float,
        is_best: bool = False
    ) -> None:
        """Save model checkpoint"""
        checkpoint = {
            'epoch': epoch,
            'model_state_dict': self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict(),
            'val_loss': val_loss,
            'config': self.config
        }
        
        # Save latest checkpoint
        path = Path(self.config['checkpoint_dir'])
        path.mkdir(parents=True, exist_ok=True)
        
        torch.save(
            checkpoint,
            path / 'latest_checkpoint.pt'
        )
        
        # Save best model
        if is_best:
            torch.save(
                checkpoint,
                path / 'best_model.pt'
            )
    
    def _setup_optimizer(self) -> torch.optim.Optimizer:
        """Setup optimizer based on config"""
        optimizer_config = self.config['optimizer']
        optimizer_class = getattr(torch.optim, optimizer_config['name'])
        
        return optimizer_class(
            self.model.parameters(),
            **optimizer_config['params']
        )
    
    def _setup_scheduler(self) -> Optional[torch.optim.lr_scheduler._LRScheduler]:
        """Setup learning rate scheduler"""
        scheduler_config = self.config.get('scheduler')
        if not scheduler_config:
            return None
        
        scheduler_class = getattr(
            torch.optim.lr_scheduler,
            scheduler_config['name']
        )
        
        return scheduler_class(
            self.optimizer,
            **scheduler_config['params']
        )
    
    def _setup_criterion(self) -> nn.Module:
        """Setup loss function"""
        criterion_config = self.config['criterion']
        criterion_class = getattr(nn, criterion_config['name'])
        
        return criterion_class(**criterion_config.get('params', {})) 