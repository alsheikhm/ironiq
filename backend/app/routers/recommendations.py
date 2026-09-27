from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy import func, select
from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.database import get_db
from app.models.session import (
    WorkoutExercise,
    WorkoutSession,
)
from app.schemas.recommendation import (
    RecommendationResponse,
)
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
    normalized_exercise = (
        exercise.strip().lower()
    )

    statement = (
        select(WorkoutExercise)
        .join(WorkoutSession)
        .options(
            selectinload(
                WorkoutExercise.sets
            )
        )
        .where(
            func.lower(
                WorkoutExercise.exercise
            )
            == normalized_exercise
        )
        .order_by(
            WorkoutSession.created_at.desc()
        )
        .limit(1)
    )

    latest_exercise = (
        db.scalars(statement).first()
    )


    if (
        latest_exercise is None
        or len(latest_exercise.sets) == 0
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail=(
                "No workout history found "
                "for this exercise"
            ),
        )


    top_set = max(
        latest_exercise.sets,
        key=lambda workout_set: (
            workout_set.estimated_1rm,
            workout_set.rpe,
        ),
    )


    recommended_weight = (
        calculate_recommended_weight(
            current_weight=top_set.weight,
            rpe=top_set.rpe,
        )
    )

    reason = (
        build_recommendation_reason(
            rpe=top_set.rpe,
        )
    )


    return RecommendationResponse(
        exercise=latest_exercise.exercise,
        current_weight=top_set.weight,
        recommended_weight=(
            recommended_weight
        ),
        reps=top_set.reps,
        rpe=top_set.rpe,
        reason=reason,
    )