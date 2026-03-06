from datetime import datetime

from sqlalchemy import BigInteger, Float, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class WaterReading(Base):
    """
    Stores each data point sent by the ESP32 water meter.

    Fields sent by ESP32:
      - pulses  : total pulse count since power-on
      - m3      : calculated cubic-metre reading (3 decimal places)

    Fields added by the server:
      - id        : auto-increment primary key
      - recorded_at : UTC timestamp of reception
    """

    __tablename__ = "water_readings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    pulses: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    m3: Mapped[float] = mapped_column(Float(precision=6), nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        index=True,
    )

    def __repr__(self) -> str:
        return (
            f"<WaterReading id={self.id} pulses={self.pulses} "
            f"m3={self.m3:.3f} at={self.recorded_at}>"
        )
