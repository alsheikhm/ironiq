from pydantic import BaseModel


class RecommendationResponse(BaseModel):
    exercise: str
    current_weight: float
    recommended_weight: float
    reps: int
    rpe: float
    reason: str