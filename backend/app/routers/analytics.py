from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.workout import Workout
from app.schemas.analytics import (
    AnalyticsSummary,
    PersonalRecord,
)


router = APIRouter(
    prefix="/api/analytics",
    tags=["analytics"],
)


@router.get(
    "/summary",
    response_model=AnalyticsSummary,
)
def get_analytics_summary(
    db: Session = Depends(get_db),
):
    statement = select(Workout).order_by(
        Workout.created_at.desc()
    )

    workouts = list(
        db.scalars(statement).all()
    )

    now = datetime.now(timezone.utc)

    week_start = (
        now
        - timedelta(days=now.weekday())
    ).replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    weekly_workouts: list[Workout] = []

    for workout in workouts:
        created_at = workout.created_at

        if created_at.tzinfo is None:
            created_at = created_at.replace(
                tzinfo=timezone.utc
            )

        if created_at >= week_start:
            weekly_workouts.append(workout)

    weekly_volume = sum(
        workout.training_volume
        for workout in weekly_workouts
    )

    best_by_exercise: dict[str, Workout] = {}

    for workout in workouts:
        exercise_key = workout.exercise.strip().lower()

        current_record = best_by_exercise.get(
            exercise_key
        )

        if (
            current_record is None
            or workout.estimated_1rm
            > current_record.estimated_1rm
        ):
            best_by_exercise[exercise_key] = workout

    personal_records = [
        PersonalRecord(
            exercise=workout.exercise,
            weight=workout.weight,
            reps=workout.reps,
            estimated_1rm=workout.estimated_1rm,
        )
        for workout in best_by_exercise.values()
    ]

    personal_records.sort(
        key=lambda record: record.estimated_1rm,
        reverse=True,
    )

    best_estimated_1rm = (
        personal_records[0].estimated_1rm
        if personal_records
        else None
    )

    return AnalyticsSummary(
        total_workouts=len(workouts),
        workouts_this_week=len(weekly_workouts),
        weekly_volume=round(weekly_volume, 1),
        best_estimated_1rm=best_estimated_1rm,
        personal_records=personal_records,
    )