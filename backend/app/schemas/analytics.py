from pydantic import BaseModel


class PersonalRecord(BaseModel):
    exercise: str
    weight: float
    reps: int
    estimated_1rm: float


class AnalyticsSummary(BaseModel):
    total_workouts: int
    workouts_this_week: int
    weekly_volume: float
    best_estimated_1rm: float | None
    personal_records: list[PersonalRecord]