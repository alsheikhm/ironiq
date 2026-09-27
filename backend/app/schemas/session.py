from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class WorkoutSetCreate(BaseModel):
    weight: float = Field(gt=0)
    reps: int = Field(gt=0, le=100)
    rpe: float = Field(ge=1, le=10)


class WorkoutExerciseCreate(BaseModel):
    exercise: str = Field(
        min_length=1,
        max_length=100,
    )

    sets: list[WorkoutSetCreate] = Field(
        min_length=1,
    )


class WorkoutSessionCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100,
    )

    exercises: list[WorkoutExerciseCreate] = Field(
        min_length=1,
    )


class WorkoutSetResponse(WorkoutSetCreate):
    id: int
    set_number: int
    training_volume: float
    estimated_1rm: float

    model_config = ConfigDict(
        from_attributes=True,
    )


class WorkoutExerciseResponse(BaseModel):
    id: int
    exercise: str
    exercise_order: int
    sets: list[WorkoutSetResponse]

    model_config = ConfigDict(
        from_attributes=True,
    )


class WorkoutSessionResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    exercises: list[WorkoutExerciseResponse]

    model_config = ConfigDict(
        from_attributes=True,
    )