"""
Image Forensics & GeoTag Verification Endpoints
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from PIL import UnidentifiedImageError
from typing import Optional
from app.core.config import settings
from app.models.schemas import ImageAuditResponse
from app.services.image_forensics import image_forensics_service

router = APIRouter()

@router.post("/verify-images", response_model=ImageAuditResponse, tags=["Forensics & Evidence"])
async def verify_site_images(
    current_image: UploadFile = File(..., description="Uploaded site photo to audit"),
    reference_image: Optional[UploadFile] = File(None, description="Previous/Historical project image for duplicate check"),
    sanctioned_lat: float = Form(..., examples=[21.3851]),
    sanctioned_lon: float = Form(..., examples=[74.9023]),
    photo_lat: Optional[float] = Form(None, examples=[21.3860]),
    photo_lon: Optional[float] = Form(None, examples=[74.9030])
):
    current_bytes = await current_image.read()
    if not current_bytes or len(current_bytes) > settings.MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Current image is empty or exceeds the maximum upload size.")
    ref_bytes = await reference_image.read() if reference_image else None
    if ref_bytes and len(ref_bytes) > settings.MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Reference image exceeds the maximum upload size.")
    
    try:
        result = image_forensics_service.audit_evidence(
            uploaded_bytes=current_bytes,
            reference_bytes=ref_bytes,
            sanctioned_lat=sanctioned_lat,
            sanctioned_lon=sanctioned_lon,
            photo_lat=photo_lat,
            photo_lon=photo_lon
        )
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=422, detail="Uploaded file is not a valid image.") from exc
    
    return ImageAuditResponse(
        is_duplicate=result["is_duplicate"],
        similarity_score=result["similarity_score"],
        gps_distance_meters=result["gps_distance_meters"],
        is_location_valid=result["is_location_valid"],
        audit_verdict=result["audit_verdict"],
        details={"verdict_flags": result["flags"]}
    )
