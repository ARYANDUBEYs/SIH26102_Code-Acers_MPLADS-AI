"""
Sarvam Indic Intelligence API Endpoints
MoSPI MPLADS-AI Multilingual & Voice Architecture
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.services.sarvam_ai import sarvam_service, SUPPORTED_INDIC_LANGUAGES

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    target_language_code: str = "hi-IN"
    source_language_code: str = "en-IN"

class VoiceGrievanceRequest(BaseModel):
    transcript: str
    language_code: str = "hi-IN"
    project_id: Optional[str] = None
    district: Optional[str] = "Nandurbar"

class AudioBriefingRequest(BaseModel):
    project_title: str
    district: str
    risk_score: float
    cartel_warning: bool = False
    language_code: str = "hi-IN"

@router.get("/languages", summary="List supported Indic languages")
async def get_supported_languages() -> List[Dict[str, str]]:
    """Returns the 8 supported Indic languages with native typography."""
    return SUPPORTED_INDIC_LANGUAGES

@router.post("/translate", summary="Translate text using Sarvam Indic engine")
async def translate_text(req: TranslationRequest) -> Dict[str, Any]:
    """Translates audit findings, cartel alerts, or status text to regional Indian language."""
    res = await sarvam_service.translate_text(
        text=req.text,
        target_lang=req.target_language_code,
        source_lang=req.source_language_code
    )
    return res

@router.post("/briefing-voice", summary="Synthesize Indic voice briefing for field officials")
async def generate_voice_briefing(req: AudioBriefingRequest) -> Dict[str, Any]:
    """
    Synthesizes an audio briefing using Sarvam AI Bulbul TTS.
    Allows MPs and District Collectors to listen to project audit briefings in regional dialects.
    """
    # Construct briefing script
    if req.language_code == "hi-IN":
        cartel_text = "सावधान: ठेकेदार कार्टेल सिंडिकेट पाया गया है।" if req.cartel_warning else "ठेकेदार वितरण सामान्य है।"
        briefing = f"एमपीलैड्स ऑडिट ब्रीफिंग: {req.district} ज़िला। परियोजना: {req.project_title}। समग्र जोखिम स्कोर {req.risk_score:.1f} है। {cartel_text}"
    elif req.language_code == "mr-IN":
        cartel_text = "सावधान: कंत्राटदार मक्तेदारी धोका आढळला आहे." if req.cartel_warning else "कंत्राटदार वितरण सामान्य आहे."
        briefing = f"खासदार निधी ऑडिट अहवाल: {req.district} जिल्हा. प्रकल्प: {req.project_title}. एकूण धोका निर्देशांक {req.risk_score:.1f} आहे. {cartel_text}"
    else:
        cartel_text = "Warning: Contractor cartel syndicate detected." if req.cartel_warning else "Contractor distribution normal."
        briefing = f"MPLADS Audit Briefing for {req.district} district. Project: {req.project_title}. Overall Risk Score is {req.risk_score:.1f}. {cartel_text}"

    tts_res = await sarvam_service.generate_indic_audio_briefing(briefing, target_lang=req.language_code)
    tts_res["briefing_text"] = briefing
    return tts_res

@router.post("/voice-grievance", summary="Process rural citizen vernacular voice grievance")
async def process_voice_grievance(req: VoiceGrievanceRequest) -> Dict[str, Any]:
    """
    Ingests and analyzes rural citizen reports in Hindi, Marathi, Tamil, etc.,
    transcribes, and maps to the central fraud detection system.
    """
    return await sarvam_service.process_voice_grievance(
        transcript_text=req.transcript,
        detected_language=req.language_code
    )
