from typing import Tuple, Dict
from torch.utils.data import DataLoader, random_split
from .datasets import BeatDetectionDataset, KeyDetectionDataset

def get_beat_detection_loaders(
    audio_dir: str,
    annotation_file: str,
    batch_size: int = 32,
    train_split: float = 0.8,
    num_workers: int = 4,
    **dataset_kwargs
) -> Tuple[DataLoader, DataLoader]:
    """Get train and validation dataloaders for beat detection"""
    # Create dataset
    dataset = BeatDetectionDataset(
        audio_dir,
        annotation_file,
        **dataset_kwargs
    )
    
    # Split dataset
    train_size = int(train_split * len(dataset))
    val_size = len(dataset) - train_size
    
    train_dataset, val_dataset = random_split(
        dataset, [train_size, val_size])
    
    # Create dataloaders
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers
    )
    
    return train_loader, val_loader

def get_key_detection_loaders(
    audio_dir: str,
    annotation_file: str,
    batch_size: int = 32,
    train_split: float = 0.8,
    num_workers: int = 4,
    **dataset_kwargs
) -> Tuple[DataLoader, DataLoader]:
    """Get train and validation dataloaders for key detection"""
    # Create dataset
    dataset = KeyDetectionDataset(
        audio_dir,
        annotation_file,
        **dataset_kwargs
    )
    
    # Split dataset
    train_size = int(train_split * len(dataset))
    val_size = len(dataset) - train_size
    
    train_dataset, val_dataset = random_split(
        dataset, [train_size, val_size])
    
    # Create dataloaders
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers
    )
    
    return train_loader, val_loader 