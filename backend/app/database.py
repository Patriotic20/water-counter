import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

logger = logging.getLogger(__name__)

# ───────────────────────────────────────────
# Engine
# ───────────────────────────────────────────
engine = create_async_engine(
    settings.database_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,          # reconnect on stale connections
    echo=settings.is_development,
)

# ───────────────────────────────────────────
# Session factory
# ───────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


# ───────────────────────────────────────────
# Base model
# ───────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ───────────────────────────────────────────
# Dependency injection (FastAPI)
# ───────────────────────────────────────────
async def get_db() -> AsyncIterator[AsyncSession]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# ───────────────────────────────────────────
# Lifecycle: create / drop tables
# ───────────────────────────────────────────
@asynccontextmanager
async def lifespan_db():
    """Called on app startup to create tables."""
    async with engine.begin() as conn:
        from app import models  # noqa: F401  — registers models with Base
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created / verified ✓")
    yield
    await engine.dispose()
    logger.info("Database connection pool closed ✓")
