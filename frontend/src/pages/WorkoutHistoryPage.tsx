import { useEffect, useState } from "react";

import {
  deleteWorkout,
  getWorkouts,
} from "../api/workouts";

import type { Workout } from "../types/workout";


function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  async function handleDelete(workoutId: number) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteWorkout(workoutId);

      setWorkouts((currentWorkouts) =>
        currentWorkouts.filter(
          (workout) => workout.id !== workoutId
        )
      );
    } catch {
      setError("Unable to delete workout.");
    }
  }


  useEffect(() => {
    let cancelled = false;

    async function fetchWorkouts() {
      try {
        const savedWorkouts = await getWorkouts();

        if (!cancelled) {
          setWorkouts(savedWorkouts);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load workouts. Make sure the backend server is running."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchWorkouts();

    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <main>
      <h2>Workout History</h2>

      <p>Review your previously recorded workouts.</p>

      {isLoading && <p>Loading workouts...</p>}

      {error && <p>{error}</p>}

      {!isLoading &&
        !error &&
        workouts.length === 0 && (
          <p>No workouts recorded yet.</p>
        )}

      {!isLoading &&
        workouts.map((workout) => (
          <section key={workout.id}>
            <h3>{workout.exercise}</h3>

            <p>
              {workout.sets} sets × {workout.reps} reps ×{" "}
              {workout.weight} lb
            </p>

            <p>RPE: {workout.rpe}</p>

            <p>
              Logged:{" "}
              {new Date(workout.created_at).toLocaleString()}
            </p>

            <button
              type="button"
              onClick={() => handleDelete(workout.id)}
            >
              Delete
            </button>
          </section>
        ))}
    </main>
  );
}


export default WorkoutHistoryPage;