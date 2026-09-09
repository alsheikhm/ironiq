from app.services.recommendations import (
    build_recommendation_reason,
    calculate_recommended_weight,
)


def test_low_rpe_increases_weight():
    result = calculate_recommended_weight(
        current_weight=185,
        rpe=7.5,
    )

    assert result == 190.0


def test_moderate_rpe_maintains_weight():
    result = calculate_recommended_weight(
        current_weight=185,
        rpe=8.5,
    )

    assert result == 185.0


def test_high_rpe_reduces_weight():
    result = calculate_recommended_weight(
        current_weight=185,
        rpe=9.5,
    )

    assert result == 180.0


def test_recommendation_has_reason():
    reason = build_recommendation_reason(rpe=7.5)

    assert len(reason) > 0