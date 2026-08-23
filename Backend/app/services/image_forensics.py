"""
Computer Vision & Image Forensics Engine
Detects duplicate site images across projects and verifies GPS EXIF boundaries using Haversine Geofencing.
"""
import io
import math
import numpy as np
from PIL import Image
from typing import Tuple, Dict, Any, Optional
from app.core.config import settings

class ImageForensicsEngine:
    @staticmethod
    def compute_perceptual_hash(image: Image.Image, hash_size: int = 16) -> np.ndarray:
        """
        Computes a custom 2D gradient difference hash (dHash) for fast structural comparison.
        """
        # Convert to grayscale and resize to (hash_size + 1, hash_size)
        resized = image.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
        pixels = np.asarray(resized, dtype=np.float32)
        
        # Calculate horizontal gradient differences
        difference = pixels[:, 1:] > pixels[:, :-1]
        return difference.flatten()

    @staticmethod
    def compute_color_histogram_vector(image: Image.Image) -> np.ndarray:
        """
        Extracts a normalized 3D color distribution vector across RGB spectrums.
        """
        rgb_img = image.convert("RGB").resize((128, 128), Image.Resampling.BILINEAR)
        arr = np.asarray(rgb_img, dtype=np.float32)
        
        # Compute normalized histograms for each color channel
        hist_r, _ = np.histogram(arr[:, :, 0], bins=16, range=(0, 256), density=True)
        hist_g, _ = np.histogram(arr[:, :, 1], bins=16, range=(0, 256), density=True)
        hist_b, _ = np.histogram(arr[:, :, 2], bins=16, range=(0, 256), density=True)
        
        feature_vec = np.concatenate([hist_r, hist_g, hist_b])
        norm = np.linalg.norm(feature_vec)
        return feature_vec / (norm + 1e-7)

    @classmethod
    def calculate_visual_similarity(cls, img1_bytes: bytes, img2_bytes: bytes) -> float:
        """
        Dual-stage similarity combining Perceptual Hash Hamming distance and Histogram Cosine Similarity.
        """
        image1 = Image.open(io.BytesIO(img1_bytes))
        image2 = Image.open(io.BytesIO(img2_bytes))
        
        # Stage 1: Perceptual Structural Hash
        hash1 = cls.compute_perceptual_hash(image1)
        hash2 = cls.compute_perceptual_hash(image2)
        hash_similarity = 1.0 - (np.count_nonzero(hash1 != hash2) / float(len(hash1)))
        
        # Stage 2: Deep Color Distribution Cosine Similarity
        vec1 = cls.compute_color_histogram_vector(image1)
        vec2 = cls.compute_color_histogram_vector(image2)
        cosine_sim = float(np.dot(vec1, vec2))
        
        # Weighted Composite Similarity Score
        composite_score = (0.65 * hash_similarity) + (0.35 * cosine_sim)
        return round(float(np.clip(composite_score, 0.0, 1.0)), 4)

    @staticmethod
    def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates physical great-circle distance between two GPS coordinates in meters.
        """
        R = 6371000.0  # Radius of Earth in meters
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_phi / 2.0) ** 2) + \
            (math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        
        return round(R * c, 2)

    @classmethod
    def audit_evidence(cls, 
                       uploaded_bytes: bytes, 
                       reference_bytes: Optional[bytes],
                       sanctioned_lat: float, 
                       sanctioned_lon: float,
                       photo_lat: Optional[float] = None, 
                       photo_lon: Optional[float] = None) -> Dict[str, Any]:
        """
        End-to-end forensic evaluation of submitted project photo proof.
        """
        similarity = 0.0
        is_duplicate = False
        
        if reference_bytes is not None:
            similarity = cls.calculate_visual_similarity(uploaded_bytes, reference_bytes)
            is_duplicate = similarity >= settings.DUPLICATE_IMAGE_SIMILARITY_CUTOFF
            
        gps_distance = 0.0
        is_loc_valid = True
        
        if photo_lat is not None and photo_lon is not None:
            gps_distance = cls.calculate_haversine_distance(sanctioned_lat, sanctioned_lon, photo_lat, photo_lon)
            is_loc_valid = gps_distance <= settings.MAX_ALLOWED_GPS_DEVIATION_METERS
            
        verdict_flags = []
        if is_duplicate:
            verdict_flags.append(f"CRITICAL: Visual fingerprint match ({similarity*100:.1f}%) detected with another project photo.")
        if not is_loc_valid:
            verdict_flags.append(f"WARNING: Photo capture location deviates by {gps_distance:.1f}m from sanctioned project coordinates.")
            
        return {
            "is_duplicate": is_duplicate,
            "similarity_score": similarity,
            "gps_distance_meters": gps_distance,
            "is_location_valid": is_loc_valid,
            "audit_verdict": "FLAGGED_FOR_AUDIT" if (is_duplicate or not is_loc_valid) else "VERIFIED_AUTHENTIC",
            "flags": verdict_flags
        }

image_forensics_service = ImageForensicsEngine()
