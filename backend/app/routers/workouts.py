from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.workout import Workout
from app.schemas.workout import WorkoutCreate, WorkoutResponse


router = APIRouter(
    prefix="/api/workouts",
    tags=["workouts"],
)


@router.post(
    "",
    response_model=WorkoutResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_workout(
    workout: WorkoutCreate,
    db: Session = Depends(get_db),
):
    new_workout = Workout(**workout.model_dump())

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    return new_workout


@router.get(
    "",
    response_model=list[WorkoutResponse],
)
def get_workouts(
    db: Session = Depends(get_db),
):
    statement = select(Workout).order_by(Workout.created_at.desc())

    workouts = db.scalars(statement).all()

    return workouts


@router.delete(
    "/{workout_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
):
    workout = db.get(Workout, workout_id)

    if workout is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found",
        )

    db.delete(workout)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)