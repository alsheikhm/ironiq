from app.services.calculations import (
    calculate_estimated_1rm,
    calculate_training_volume,
)


def test_training_volume():
    result = calculate_training_volume(
        sets=3,
        weight=185,
        reps=8,
    )

    assert result == 4440.0


def test_estimated_1rm():
    result = calculate_estimated_1rm(
        weight=185,
        reps=8,
    )

    assert result == 234.3


def test_single_rep_uses_actual_weight():
    result = calculate_estimated_1rm(
        weight=225,
        reps=1,
    )

    assert result == 225.0