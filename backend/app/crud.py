import logging
from datetime import datetime

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import WaterReading
from app.schemas import WaterReadingCreate

logger = logging.getLogger(__name__)


async def create_reading(
    db: AsyncSession,
    data: WaterReadingCreate,
) -> WaterReading:
    """Persist a new water reading from the ESP32."""
    reading = WaterReading(pulses=data.pulses, m3=data.m3)
    db.add(reading)
    await db.flush()          # get auto-generated id without full commit
    await db.refresh(reading)
    logger.debug("Saved reading id=%s pulses=%s m3=%.3f", reading.id, reading.pulses, reading.m3)
    return reading


async def get_latest(
    db: AsyncSession,
    limit: int = 1,
) -> list[WaterReading]:
    """Return the most recent N readings, newest first."""
    result = await db.execute(
        select(WaterReading)
        .order_by(desc(WaterReading.recorded_at))
        .limit(limit)
    )
    return list(result.scalars().all())


async def get_readings(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
) -> tuple[int, list[WaterReading]]:
    """Return paginated readings with total count."""
    total_result = await db.execute(select(func.count()).select_from(WaterReading))
    total: int = total_result.scalar_one()

    result = await db.execute(
        select(WaterReading)
        .order_by(desc(WaterReading.recorded_at))
        .offset(skip)
        .limit(limit)
    )
    return total, list(result.scalars().all())


async def get_readings_since(
    db: AsyncSession,
    since: datetime,
) -> list[WaterReading]:
    """Return all readings after a given UTC timestamp."""
    result = await db.execute(
        select(WaterReading)
        .where(WaterReading.recorded_at >= since)
        .order_by(WaterReading.recorded_at)
    )
    return list(result.scalars().all())
