from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class WorkoutCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    exercise: str = Field(min_length=1, max_length=100)
    sets: int = Field(gt=0, le=100)
    weight: float = Field(gt=0)
    reps: int = Field(gt=0, le=100)
    rpe: float = Field(ge=1, le=10)


class WorkoutResponse(WorkoutCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True,
    )