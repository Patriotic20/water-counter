from datetime import datetime

from pydantic import BaseModel, Field, field_validator


# ───────────────────────────────────────────
# Request — from ESP32
# ───────────────────────────────────────────
class WaterReadingCreate(BaseModel):
    """Payload sent by ESP32 every second."""

    user_id: int | None = Field(None, description="Optional user ID associated with this reading")
    pulses: int = Field(..., ge=0, description="Total pulse count since boot")
    m3: float = Field(..., ge=0.0, description="Cubic metres (3 decimal precision)")

    @field_validator("m3")
    @classmethod
    def round_m3(cls, v: float) -> float:
        return round(v, 3)


# ───────────────────────────────────────────
# Response — to clients
# ───────────────────────────────────────────
class WaterReadingOut(BaseModel):
    id: int
    user_id: int | None
    pulses: int
    m3: float
    recorded_at: datetime

    model_config = {"from_attributes": True}


# ───────────────────────────────────────────
# Paginated list response
# ───────────────────────────────────────────
class WaterReadingList(BaseModel):
    total: int
    items: list[WaterReadingOut]


# ───────────────────────────────────────────
# Health check
# ───────────────────────────────────────────
class HealthOut(BaseModel):
    status: str
    db: str
    version: str = "1.0.0"


# ───────────────────────────────────────────
# User CRUD & Usage
# ───────────────────────────────────────────
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)


class UserOut(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class UserUsageOut(BaseModel):
    user_id: int
    name: str
    total_m3: float
