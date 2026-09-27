from app.services.calculations import (
    calculate_estimated_1rm,
    calculate_set_volume,
)

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

def test_set_volume():
    result = calculate_set_volume(
        weight=185,
        reps=8,
    )

    assert result == 1480.0