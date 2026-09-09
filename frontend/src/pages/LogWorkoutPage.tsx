import { useState, type FormEvent } from "react";

import { createWorkout } from "../api/workouts";
import type { Workout } from "../types/workout";

import { getRecommendation } from "../api/recommendations";
import type { Recommendation } from "../types/recommendation";


function LogWorkoutPage() {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");

  const [lastSavedWorkout, setLastSavedWorkout] =
    useState<Workout | null>(null);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recommendation, setRecommendation] =
  useState<Recommendation | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const setsNumber = Number(sets);
    const weightNumber = Number(weight);
    const repsNumber = Number(reps);
    const rpeNumber = Number(rpe);

    if (exercise.trim() === "") {
      setError("Please enter an exercise name.");
      return;
    }

    if (setsNumber <= 0) {
      setError("Sets must be greater than 0.");
      return;
    }

    if (weightNumber <= 0) {
      setError("Weight must be greater than 0.");
      return;
    }

    if (repsNumber <= 0) {
      setError("Reps must be greater than 0.");
      return;
    }

    if (rpeNumber < 1 || rpeNumber > 10) {
      setError("RPE must be between 1 and 10.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const savedWorkout = await createWorkout({
        exercise: exercise.trim(),
        sets: setsNumber,
        weight: weightNumber,
        reps: repsNumber,
        rpe: rpeNumber,
      });

      setLastSavedWorkout(savedWorkout);

      const nextRecommendation =
        await getRecommendation(savedWorkout.exercise);

      setRecommendation(nextRecommendation);

      setExercise("");
      setSets("");
      setWeight("");
      setReps("");
      setRpe("");
    } catch {
      setError(
        "Unable to save workout. Make sure the backend server is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <main>
      <h2>Log Workout</h2>

      <p>
        Record your working sets and track your strength progress.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="exercise">Exercise</label>

          <input
            id="exercise"
            type="text"
            placeholder="Bench Press"
            value={exercise}
            onChange={(event) => setExercise(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sets">Sets</label>

          <input
            id="sets"
            type="number"
            placeholder="3"
            min="1"
            value={sets}
            onChange={(event) => setSets(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="weight">Weight (lb)</label>

          <input
            id="weight"
            type="number"
            placeholder="185"
            min="0"
            step="0.5"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="reps">Reps</label>

          <input
            id="reps"
            type="number"
            placeholder="8"
            min="1"
            value={reps}
            onChange={(event) => setReps(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="rpe">RPE</label>

          <input
            id="rpe"
            type="number"
            placeholder="8"
            min="1"
            max="10"
            step="0.5"
            value={rpe}
            onChange={(event) => setRpe(event.target.value)}
          />
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Add Workout"}
        </button>
      </form>

      {lastSavedWorkout && (
        <section className="success-card">
          <h3>Workout Saved</h3>

          <h4>{lastSavedWorkout.exercise}</h4>

          <p>
            {lastSavedWorkout.sets} sets ×{" "}
            {lastSavedWorkout.reps} reps ×{" "}
            {lastSavedWorkout.weight} lb
          </p>

          <p>RPE: {lastSavedWorkout.rpe}</p>
        </section>
      )}

      {recommendation && (
        <section>
          <h3>Next Session Recommendation</h3>

          <h4>{recommendation.exercise}</h4>

          <p>
            Recommended Weight:{" "}
            {recommendation.recommended_weight} lb
          </p>

          <p>
            Target Reps: {recommendation.reps}
          </p>

          <p>{recommendation.reason}</p>
        </section>
      )}
    </main>
  );
}


export default LogWorkoutPage;