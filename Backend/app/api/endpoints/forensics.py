"""
Image Forensics & GeoTag Verification Endpoints
"""
from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.models.schemas import ImageAuditResponse
from app.services.image_forensics import image_forensics_service

router = APIRouter()

@router.post("/verify-images", response_model=ImageAuditResponse, tags=["Forensics & Evidence"])
async def verify_site_images(
    current_image: UploadFile = File(..., description="Uploaded site photo to audit"),
    reference_image: Optional[UploadFile] = File(None, description="Previous/Historical project image for duplicate check"),
    sanctioned_lat: float = Form(..., example=21.3851),
    sanctioned_lon: float = Form(..., example=74.9023),
    photo_lat: Optional[float] = Form(None, example=21.3860),
    photo_lon: Optional[float] = Form(None, example=74.9030)
):
    current_bytes = await current_image.read()
    ref_bytes = await reference_image.read() if reference_image else None
    
    result = image_forensics_service.audit_evidence(
        uploaded_bytes=current_bytes,
        reference_bytes=ref_bytes,
        sanctioned_lat=sanctioned_lat,
        sanctioned_lon=sanctioned_lon,
        photo_lat=photo_lat,
        photo_lon=photo_lon
    )
    
    return ImageAuditResponse(
        is_duplicate=result["is_duplicate"],
        similarity_score=result["similarity_score"],
        gps_distance_meters=result["gps_distance_meters"],
        is_location_valid=result["is_location_valid"],
        audit_verdict=result["audit_verdict"],
        details={"verdict_flags": result["flags"]}
    )
