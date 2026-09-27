from datetime import (
    datetime,
    timedelta,
    timezone,
)

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.database import get_db
from app.models.session import (
    WorkoutExercise,
    WorkoutSession,
    WorkoutSet,
)
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
    statement = (
        select(WorkoutSession)
        .options(
            selectinload(
                WorkoutSession.exercises
            ).selectinload(
                WorkoutExercise.sets
            )
        )
        .order_by(
            WorkoutSession.created_at.desc()
        )
    )

    sessions = list(
        db.scalars(statement)
        .unique()
        .all()
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


    weekly_sessions: list[
        WorkoutSession
    ] = []

    for workout_session in sessions:
        created_at = (
            workout_session.created_at
        )

        if created_at.tzinfo is None:
            created_at = created_at.replace(
                tzinfo=timezone.utc
            )

        if created_at >= week_start:
            weekly_sessions.append(
                workout_session
            )


    weekly_volume = sum(
        workout_set.training_volume
        for workout_session
        in weekly_sessions
        for exercise
        in workout_session.exercises
        for workout_set
        in exercise.sets
    )


    best_by_exercise: dict[
        str,
        tuple[str, WorkoutSet],
    ] = {}


    for workout_session in sessions:
        for exercise in (
            workout_session.exercises
        ):
            exercise_key = (
                exercise.exercise
                .strip()
                .lower()
            )

            for workout_set in exercise.sets:
                current_record = (
                    best_by_exercise.get(
                        exercise_key
                    )
                )

                if (
                    current_record is None
                    or workout_set.estimated_1rm
                    > current_record[
                        1
                    ].estimated_1rm
                ):
                    best_by_exercise[
                        exercise_key
                    ] = (
                        exercise.exercise,
                        workout_set,
                    )


    personal_records = [
        PersonalRecord(
            exercise=exercise_name,
            weight=workout_set.weight,
            reps=workout_set.reps,
            estimated_1rm=(
                workout_set.estimated_1rm
            ),
        )
        for (
            exercise_name,
            workout_set,
        ) in best_by_exercise.values()
    ]


    personal_records.sort(
        key=lambda record:
            record.estimated_1rm,
        reverse=True,
    )


    best_estimated_1rm = (
        personal_records[
            0
        ].estimated_1rm
        if personal_records
        else None
    )


    return AnalyticsSummary(
        total_workouts=len(sessions),
        workouts_this_week=len(
            weekly_sessions
        ),
        weekly_volume=round(
            weekly_volume,
            1,
        ),
        best_estimated_1rm=(
            best_estimated_1rm
        ),
        personal_records=(
            personal_records
        ),
    )