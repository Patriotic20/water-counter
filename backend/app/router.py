import logging

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.database import get_db
from app.schemas import HealthOut, WaterReadingCreate, WaterReadingList, WaterReadingOut
from app.websocket import manager

logger = logging.getLogger(__name__)

router = APIRouter()


# ─────────────────────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────────────────────
@router.get("/health", response_model=HealthOut, tags=["System"])
async def health_check(db: AsyncSession = Depends(get_db)) -> HealthOut:
    """Liveness + database connectivity check."""
    try:
        await db.execute(__import__("sqlalchemy").text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        logger.error("DB health check failed: %s", e)
        db_status = "error"

    return HealthOut(status="ok", db=db_status)


# ─────────────────────────────────────────────────────────────
# POST /api/data  ←  ESP32 sends here every second
# ─────────────────────────────────────────────────────────────
@router.post(
    "/api/data",
    response_model=WaterReadingOut,
    status_code=201,
    tags=["Readings"],
    summary="Receive data from ESP32 water meter",
)
async def receive_reading(
    payload: WaterReadingCreate,
    db: AsyncSession = Depends(get_db),
) -> WaterReadingOut:
    """
    Called by the ESP32 every second.
    Saves the reading to PostgreSQL and broadcasts to all WebSocket clients.
    """
    reading = await crud.create_reading(db, payload)
    out = WaterReadingOut.model_validate(reading)

    # Broadcast to live dashboards (fire-and-forget)
    await manager.broadcast(out.model_dump())

    return out


# ─────────────────────────────────────────────────────────────
# GET /api/data  — paginated history
# ─────────────────────────────────────────────────────────────
@router.get(
    "/api/data",
    response_model=WaterReadingList,
    tags=["Readings"],
    summary="Get paginated reading history",
)
async def list_readings(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Max records to return"),
    db: AsyncSession = Depends(get_db),
) -> WaterReadingList:
    total, items = await crud.get_readings(db, skip=skip, limit=limit)
    return WaterReadingList(total=total, items=[WaterReadingOut.model_validate(r) for r in items])


# ─────────────────────────────────────────────────────────────
# GET /api/data/latest  — last N readings
# ─────────────────────────────────────────────────────────────
@router.get(
    "/api/data/latest",
    response_model=list[WaterReadingOut],
    tags=["Readings"],
    summary="Get the most recent readings",
)
async def latest_readings(
    n: int = Query(1, ge=1, le=100, description="How many recent readings to return"),
    db: AsyncSession = Depends(get_db),
) -> list[WaterReadingOut]:
    readings = await crud.get_latest(db, limit=n)
    if not readings:
        raise HTTPException(status_code=404, detail="No readings available yet")
    return [WaterReadingOut.model_validate(r) for r in readings]


# ─────────────────────────────────────────────────────────────
# WS /ws/live  — real-time dashboard
# ─────────────────────────────────────────────────────────────
@router.websocket("/ws/live")
async def websocket_live(websocket: WebSocket) -> None:
    """
    WebSocket endpoint for real-time dashboards.
    Every time the ESP32 sends a new reading, it is broadcast here instantly.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive; we only send, not receive
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        logger.error("WS error: %s", e)
        await manager.disconnect(websocket)
