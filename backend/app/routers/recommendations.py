from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.workout import Workout
from app.schemas.recommendation import RecommendationResponse
from app.services.recommendations import (
    build_recommendation_reason,
    calculate_recommended_weight,
)


router = APIRouter(
    prefix="/api/recommendations",
    tags=["recommendations"],
)


@router.get(
    "/{exercise}",
    response_model=RecommendationResponse,
)
def get_recommendation(
    exercise: str,
    db: Session = Depends(get_db),
):
    normalized_exercise = exercise.strip().lower()

    statement = (
        select(Workout)
        .where(
            func.lower(Workout.exercise)
            == normalized_exercise
        )
        .order_by(Workout.created_at.desc())
        .limit(1)
    )

    latest_workout = db.scalars(statement).first()

    if latest_workout is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No workout history found for this exercise",
        )

    recommended_weight = calculate_recommended_weight(
        current_weight=latest_workout.weight,
        rpe=latest_workout.rpe,
    )

    reason = build_recommendation_reason(
        rpe=latest_workout.rpe,
    )

    return RecommendationResponse(
        exercise=latest_workout.exercise,
        current_weight=latest_workout.weight,
        recommended_weight=recommended_weight,
        reps=latest_workout.reps,
        rpe=latest_workout.rpe,
        reason=reason,
    )