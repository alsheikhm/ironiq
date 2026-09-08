import { useState, type FormEvent } from "react";
import type { WorkoutEntry } from "../types/workout";

function LogWorkoutPage() {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");

  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const setsNumber = Number(sets);
    const weightNumber = Number(weight);
    const repsNumber = Number(reps);
    const rpeNumber = Number(rpe);

    if (
      exercise.trim() === "" ||
      setsNumber <= 0 ||
      weightNumber <= 0 ||
      repsNumber <= 0 ||
      rpeNumber < 1 ||
      rpeNumber > 10
    ) {
      setError("Please enter valid workout information.");
      return;
    }

    const newWorkout: WorkoutEntry = {
      id: Date.now(),
      exercise: exercise.trim(),
      sets: setsNumber,
      weight: weightNumber,
      reps: repsNumber,
      rpe: rpeNumber,
    };

    setWorkouts((currentWorkouts) => [...currentWorkouts, newWorkout]);

    setExercise("");
    setSets("");
    setWeight("");
    setReps("");
    setRpe("");
    setError("");
  }

  return (
    <main>
      <h2>Log Workout</h2>
      <p>Record your working sets and track your strength progress.</p>

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

        {error && <p>{error}</p>}

        <button type="submit">Add Workout</button>
      </form>

      <section>
        <h3>Current Workout</h3>

        {workouts.length === 0 ? (
          <p>No exercises logged yet.</p>
        ) : (
          workouts.map((workout) => (
            <div key={workout.id}>
              <h4>{workout.exercise}</h4>

              <p>
                {workout.sets} sets × {workout.reps} reps × {workout.weight} lb
              </p>

              <p>RPE: {workout.rpe}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default LogWorkoutPage;