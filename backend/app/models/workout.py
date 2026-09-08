from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Workout(Base):
    __tablename__ = "workouts"

    id: Mapped[int] = mapped_column(primary_key=True)

    exercise: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    sets: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    weight: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    reps: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    rpe: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )