def calculate_recommended_weight(
    current_weight: float,
    rpe: float,
) -> float:
    if rpe <= 8:
        return round(current_weight + 5, 1)

    if rpe <= 9:
        return round(current_weight, 1)

    return round(max(current_weight - 5, 0), 1)


def build_recommendation_reason(
    rpe: float,
) -> str:
    if rpe <= 8:
        return (
            "You completed the workout at a manageable RPE, "
            "so a small increase in weight is recommended."
        )

    if rpe <= 9:
        return (
            "The workout was challenging but manageable, "
            "so keeping the same weight is recommended."
        )

    return (
        "The workout was very difficult, so a small reduction "
        "in weight may help you complete the target reps."
    )