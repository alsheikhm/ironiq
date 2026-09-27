from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from app.services.calculations import (
    calculate_estimated_1rm,
    calculate_set_volume,
)

class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    exercises: Mapped[list["WorkoutExercise"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="WorkoutExercise.exercise_order",
    )


class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id: Mapped[int] = mapped_column(primary_key=True)

    session_id: Mapped[int] = mapped_column(
        ForeignKey(
            "workout_sessions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    exercise: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    exercise_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    session: Mapped["WorkoutSession"] = relationship(
        back_populates="exercises",
    )

    sets: Mapped[list["WorkoutSet"]] = relationship(
        back_populates="workout_exercise",
        cascade="all, delete-orphan",
        order_by="WorkoutSet.set_number",
    )


class WorkoutSet(Base):
    __tablename__ = "workout_sets"

    id: Mapped[int] = mapped_column(primary_key=True)

    workout_exercise_id: Mapped[int] = mapped_column(
        ForeignKey(
            "workout_exercises.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    set_number: Mapped[int] = mapped_column(
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

    workout_exercise: Mapped["WorkoutExercise"] = relationship(
        back_populates="sets",
    )

    @property
    def training_volume(self) -> float:
        return calculate_set_volume(
            self.weight,
            self.reps,
        )

    @property
    def estimated_1rm(self) -> float:
        return calculate_estimated_1rm(
            self.weight,
            self.reps,
        )