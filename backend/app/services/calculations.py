def calculate_training_volume(
    sets: int,
    weight: float,
    reps: int,
) -> float:
    volume = sets * weight * reps

    return round(volume, 1)


def calculate_estimated_1rm(
    weight: float,
    reps: int,
) -> float:
    if reps <= 1:
        return round(weight, 1)

    estimated_1rm = weight * (1 + reps / 30)

    return round(estimated_1rm, 1)