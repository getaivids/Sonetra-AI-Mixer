from dataclasses import dataclass
from typing import Dict, Any, Optional
import torch
import yaml

@dataclass
class ModelConfig:
    """Configuration for model weights and training"""
    name: str
    version: str
    architecture: Dict[str, Any]
    training_params: Dict[str, Any]
    weights_path: str
    
    @classmethod
    def from_yaml(cls, path: str) -> 'ModelConfig':
        """Load config from YAML file"""
        with open(path, 'r') as f:
            config = yaml.safe_load(f)
        return cls(**config)
    
    def save_yaml(self, path: str) -> None:
        """Save config to YAML file"""
        with open(path, 'w') as f:
            yaml.dump(self.__dict__, f) 