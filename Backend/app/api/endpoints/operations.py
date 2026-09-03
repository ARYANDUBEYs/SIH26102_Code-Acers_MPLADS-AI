from datetime import datetime
from fastapi import APIRouter
from typing import Any, Dict, List

router = APIRouter()
_reports: List[Dict[str, Any]] = []
_notifications: List[Dict[str, Any]] = [{"id":"SYS-001","title":"AI Monitoring Active","message":"Continuous anomaly monitoring is operational.","unread":True,"time":"Just now"}]

@router.get("/reports")
async def get_reports():
    return {"success": True, "data": list(_reports)}

@router.post("/reports")
async def submit_report(report: Dict[str, Any]):
    item = {"id":f"CIT-{datetime.utcnow().strftime('%Y%m%d')}-{len(_reports)+1:04d}","submissionDate":datetime.utcnow().date().isoformat(),"status":"Under Verification",**report}
    _reports.insert(0,item)
    return {"success":True,"data":item}

@router.get("/notifications")
async def get_notifications():
    return {"success":True,"data":list(_notifications)}

@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id:str):
    for item in _notifications:
        if item["id"] == notification_id: item["unread"] = False
    return {"success":True}
