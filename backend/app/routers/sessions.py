from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.session import (
    WorkoutExercise,
    WorkoutSession,
    WorkoutSet,
)
from app.schemas.session import (
    WorkoutSessionCreate,
    WorkoutSessionResponse,
)


router = APIRouter(
    prefix="/api/sessions",
    tags=["workout sessions"],
)


@router.post(
    "",
    response_model=WorkoutSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_session(
    session_data: WorkoutSessionCreate,
    db: Session = Depends(get_db),
):
    workout_session = WorkoutSession(
        name=session_data.name.strip(),
    )

    for exercise_index, exercise_data in enumerate(
        session_data.exercises,
        start=1,
    ):
        workout_exercise = WorkoutExercise(
            exercise=exercise_data.exercise.strip(),
            exercise_order=exercise_index,
        )

        for set_index, set_data in enumerate(
            exercise_data.sets,
            start=1,
        ):
            workout_set = WorkoutSet(
                set_number=set_index,
                weight=set_data.weight,
                reps=set_data.reps,
                rpe=set_data.rpe,
            )

            workout_exercise.sets.append(
                workout_set
            )

        workout_session.exercises.append(
            workout_exercise
        )

    db.add(workout_session)
    db.commit()
    db.refresh(workout_session)

    return workout_session


@router.get(
    "",
    response_model=list[WorkoutSessionResponse],
)
def get_sessions(
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

    sessions = db.scalars(
        statement
    ).unique().all()

    return sessions


@router.delete(
    "/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
):
    workout_session = db.get(
        WorkoutSession,
        session_id,
    )

    if workout_session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout session not found",
        )

    db.delete(workout_session)
    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )