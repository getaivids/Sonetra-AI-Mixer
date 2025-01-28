from typing import Dict, List, Tuple, Optional
import numpy as np
import torch
from sklearn.metrics import precision_recall_fscore_support
import mir_eval
import librosa

class BeatEvaluator:
    """Evaluator for beat detection models"""
    
    def __init__(self, tolerance: float = 0.07):
        """
        Args:
            tolerance: Beat matching tolerance in seconds
        """
        self.tolerance = tolerance
    
    def evaluate(
        self,
        predictions: np.ndarray,
        ground_truth: np.ndarray,
        sr: int = 22050
    ) -> Dict[str, float]:
        """
        Evaluate beat detection performance
        
        Args:
            predictions: Predicted beat times in samples
            ground_truth: Ground truth beat times in samples
            sr: Sample rate
            
        Returns:
            Dict containing F-measure, precision, recall, etc.
        """
        # Convert to seconds
        pred_times = predictions / sr
        gt_times = ground_truth / sr
        
        # Calculate metrics
        scores = mir_eval.beat.evaluate(gt_times, pred_times)
        
        # Add additional metrics
        scores.update(self._calculate_additional_metrics(
            pred_times, gt_times))
        
        return scores
    
    def _calculate_additional_metrics(
        self,
        pred_times: np.ndarray,
        gt_times: np.ndarray
    ) -> Dict[str, float]:
        """Calculate additional beat detection metrics"""
        # Calculate tempo accuracy
        pred_tempo = self._estimate_tempo(pred_times)
        gt_tempo = self._estimate_tempo(gt_times)
        tempo_acc = self._calculate_tempo_accuracy(pred_tempo, gt_tempo)
        
        # Calculate phase alignment
        phase_score = self._calculate_phase_alignment(
            pred_times, gt_times)
        
        return {
            'tempo_accuracy': tempo_acc,
            'phase_alignment': phase_score
        }
    
    def _estimate_tempo(self, beat_times: np.ndarray) -> float:
        """Estimate tempo from beat times"""
        if len(beat_times) < 2:
            return 0.0
        
        # Calculate inter-beat intervals
        ibis = np.diff(beat_times)
        
        # Convert to BPM
        bpms = 60 / ibis
        
        # Return median tempo
        return float(np.median(bpms))
    
    def _calculate_tempo_accuracy(
        self,
        pred_tempo: float,
        gt_tempo: float,
        tolerance: float = 0.08
    ) -> float:
        """Calculate tempo accuracy with tolerance"""
        if abs(pred_tempo - gt_tempo) <= gt_tempo * tolerance:
            return 1.0
        return 0.0
    
    def _calculate_phase_alignment(
        self,
        pred_times: np.ndarray,
        gt_times: np.ndarray
    ) -> float:
        """Calculate phase alignment score"""
        # Find nearest predicted beat for each ground truth beat
        alignment_errors = []
        
        for gt in gt_times:
            if len(pred_times) == 0:
                continue
            nearest_idx = np.argmin(np.abs(pred_times - gt))
            error = abs(pred_times[nearest_idx] - gt)
            alignment_errors.append(error)
        
        if not alignment_errors:
            return 0.0
        
        # Convert errors to scores (1 = perfect alignment, 0 = poor alignment)
        scores = np.exp(-np.array(alignment_errors) / self.tolerance)
        return float(np.mean(scores))


class KeyEvaluator:
    """Evaluator for key detection models"""
    
    def __init__(self):
        self.key_distances = self._create_key_distance_matrix()
    
    def evaluate(
        self,
        predictions: torch.Tensor,
        ground_truth: torch.Tensor
    ) -> Dict[str, float]:
        """
        Evaluate key detection performance
        
        Args:
            predictions: Model predictions (B, 14) - 12 keys + 2 scales
            ground_truth: Ground truth labels (B, 2) - key and scale
            
        Returns:
            Dict containing accuracy metrics
        """
        # Split predictions
        key_preds = predictions[:, :12].argmax(dim=1)
        scale_preds = predictions[:, 12:].argmax(dim=1)
        
        # Split ground truth
        key_gt = ground_truth[:, 0]
        scale_gt = ground_truth[:, 1]
        
        # Calculate metrics
        metrics = {
            'key_accuracy': self._calculate_key_accuracy(key_preds, key_gt),
            'scale_accuracy': self._calculate_scale_accuracy(scale_preds, scale_gt),
            'weighted_accuracy': self._calculate_weighted_accuracy(
                key_preds, scale_preds, key_gt, scale_gt),
            'relative_accuracy': self._calculate_relative_accuracy(
                key_preds, key_gt)
        }
        
        return metrics
    
    def _calculate_key_accuracy(
        self,
        predictions: torch.Tensor,
        ground_truth: torch.Tensor
    ) -> float:
        """Calculate exact key match accuracy"""
        return (predictions == ground_truth).float().mean().item()
    
    def _calculate_scale_accuracy(
        self,
        predictions: torch.Tensor,
        ground_truth: torch.Tensor
    ) -> float:
        """Calculate scale (major/minor) accuracy"""
        return (predictions == ground_truth).float().mean().item()
    
    def _calculate_weighted_accuracy(
        self,
        key_preds: torch.Tensor,
        scale_preds: torch.Tensor,
        key_gt: torch.Tensor,
        scale_gt: torch.Tensor
    ) -> float:
        """Calculate weighted accuracy considering both key and scale"""
        key_correct = (key_preds == key_gt).float()
        scale_correct = (scale_preds == scale_gt).float()
        
        # Weight key more heavily than scale
        weighted = (0.7 * key_correct + 0.3 * scale_correct)
        return weighted.mean().item()
    
    def _calculate_relative_accuracy(
        self,
        predictions: torch.Tensor,
        ground_truth: torch.Tensor
    ) -> float:
        """Calculate accuracy considering relative key relationships"""
        distances = []
        for pred, gt in zip(predictions, ground_truth):
            distance = self.key_distances[pred.item(), gt.item()]
            distances.append(distance)
        
        # Convert distances to scores (1 = perfect match, 0 = worst match)
        scores = 1 - (np.array(distances) / 6)  # 6 is max distance
        return float(np.mean(scores))
    
    def _create_key_distance_matrix(self) -> np.ndarray:
        """Create matrix of distances between musical keys"""
        num_keys = 12
        distances = np.zeros((num_keys, num_keys))
        
        for i in range(num_keys):
            for j in range(num_keys):
                # Calculate minimal distance on circle of fifths
                clockwise = (j - i) % num_keys
                counterclockwise = (i - j) % num_keys
                distances[i, j] = min(clockwise, counterclockwise)
        
        return distances 