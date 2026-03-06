import logging
from datetime import datetime

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User, WaterReading
from app.schemas import UserCreate, WaterReadingCreate

logger = logging.getLogger(__name__)


async def create_reading(
    db: AsyncSession,
    data: WaterReadingCreate,
) -> WaterReading:
    """Persist a new water reading from the ESP32."""
    reading = WaterReading(user_id=data.user_id, pulses=data.pulses, m3=data.m3)
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


# ─────────────────────────────────────────────────────────────
# User CRUD
# ─────────────────────────────────────────────────────────────
async def create_user(db: AsyncSession, data: UserCreate) -> User:
    """Create a new user."""
    user = User(name=data.name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    logger.info("Created user id=%s name=%s", user.id, user.name)
    return user


async def get_users(db: AsyncSession) -> list[User]:
    """Get all users."""
    result = await db.execute(select(User).order_by(User.id))
    return list(result.scalars().all())


async def get_user_usages(db: AsyncSession) -> list[dict]:
    """
    Calculate total water usage per user.
    Assuming m3 is an absolute counter from the ESP32, 
    we take the maximum m3 reading per user as their total usage.
    """
    stmt = (
        select(
            User.id.label("user_id"),
            User.name,
            func.coalesce(func.max(WaterReading.m3), 0.0).label("total_m3")
        )
        .outerjoin(WaterReading, User.id == WaterReading.user_id)
        .group_by(User.id)
    )
    result = await db.execute(stmt)
    
    # Convert Row objects to dicts
    return [{"user_id": row.user_id, "name": row.name, "total_m3": float(row.total_m3)} for row in result.all()]
