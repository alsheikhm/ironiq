import {
  useState,
  type FormEvent,
} from "react";

import { createSession } from "../api/sessions";

import type {
  WorkoutSession,
  WorkoutSessionCreate,
} from "../types/session";

import {
  getRecommendation,
} from "../api/recommendations";

import type {
  Recommendation,
} from "../types/recommendation";

interface SetFormData {
  weight: string;
  reps: string;
  rpe: string;
}


interface ExerciseFormData {
  exercise: string;
  sets: SetFormData[];
}


function createEmptySet(): SetFormData {
  return {
    weight: "",
    reps: "",
    rpe: "",
  };
}


function createEmptyExercise(): ExerciseFormData {
  return {
    exercise: "",
    sets: [createEmptySet()],
  };
}


function LogWorkoutPage() {
  const [sessionName, setSessionName] =
    useState("");

  const [exercises, setExercises] =
    useState<ExerciseFormData[]>([
      createEmptyExercise(),
    ]);

  const [savedSession, setSavedSession] =
    useState<WorkoutSession | null>(null);

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    recommendations,
    setRecommendations,
  ] = useState<Recommendation[]>([]);

  function updateExerciseName(
    exerciseIndex: number,
    value: string
  ) {
    setExercises((currentExercises) =>
      currentExercises.map(
        (exercise, index) =>
          index === exerciseIndex
            ? {
                ...exercise,
                exercise: value,
              }
            : exercise
      )
    );
  }


  function updateSetField(
    exerciseIndex: number,
    setIndex: number,
    field: keyof SetFormData,
    value: string
  ) {
    setExercises((currentExercises) =>
      currentExercises.map(
        (exercise, currentExerciseIndex) => {
          if (
            currentExerciseIndex !==
            exerciseIndex
          ) {
            return exercise;
          }

          return {
            ...exercise,
            sets: exercise.sets.map(
              (workoutSet, currentSetIndex) =>
                currentSetIndex === setIndex
                  ? {
                      ...workoutSet,
                      [field]: value,
                    }
                  : workoutSet
            ),
          };
        }
      )
    );
  }


  function addSet(
    exerciseIndex: number
  ) {
    setExercises((currentExercises) =>
      currentExercises.map(
        (exercise, index) =>
          index === exerciseIndex
            ? {
                ...exercise,
                sets: [
                  ...exercise.sets,
                  createEmptySet(),
                ],
              }
            : exercise
      )
    );
  }


  function removeSet(
    exerciseIndex: number,
    setIndex: number
  ) {
    setExercises((currentExercises) =>
      currentExercises.map(
        (exercise, index) => {
          if (index !== exerciseIndex) {
            return exercise;
          }

          if (exercise.sets.length === 1) {
            return exercise;
          }

          return {
            ...exercise,
            sets: exercise.sets.filter(
              (_, currentSetIndex) =>
                currentSetIndex !== setIndex
            ),
          };
        }
      )
    );
  }


  function addExercise() {
    setExercises((currentExercises) => [
      ...currentExercises,
      createEmptyExercise(),
    ]);
  }


  function removeExercise(
    exerciseIndex: number
  ) {
    if (exercises.length === 1) {
      return;
    }

    setExercises((currentExercises) =>
      currentExercises.filter(
        (_, index) =>
          index !== exerciseIndex
      )
    );
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (sessionName.trim() === "") {
      setError(
        "Please enter a workout name."
      );
      return;
    }

    for (const exercise of exercises) {
      if (exercise.exercise.trim() === "") {
        setError(
          "Every exercise needs a name."
        );
        return;
      }

      for (const workoutSet of exercise.sets) {
        const weight =
          Number(workoutSet.weight);

        const reps =
          Number(workoutSet.reps);

        const rpe =
          Number(workoutSet.rpe);

        if (weight <= 0) {
          setError(
            "Every set needs a weight greater than 0."
          );
          return;
        }

        if (reps <= 0) {
          setError(
            "Every set needs at least 1 rep."
          );
          return;
        }

        if (rpe < 1 || rpe > 10) {
          setError(
            "Every set needs an RPE between 1 and 10."
          );
          return;
        }
      }
    }


    const sessionData: WorkoutSessionCreate = {
      name: sessionName.trim(),

      exercises: exercises.map(
        (exercise) => ({
          exercise:
            exercise.exercise.trim(),

          sets: exercise.sets.map(
            (workoutSet) => ({
              weight:
                Number(workoutSet.weight),

              reps:
                Number(workoutSet.reps),

              rpe:
                Number(workoutSet.rpe),
            })
          ),
        })
      ),
    };


    setError("");
    setIsSubmitting(true);


    try {
      const newSession =
        await createSession(sessionData);

      setSavedSession(newSession);

      try {
        const nextRecommendations =
          await Promise.all(
            newSession.exercises.map(
              (exercise) =>
                getRecommendation(
                  exercise.exercise
                )
            )
          );

        setRecommendations(
          nextRecommendations
        );
      } catch {
        setRecommendations([]);
      }

      setSessionName("");

      setExercises([
        createEmptyExercise(),
      ]);
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
        Record a complete workout with
        exercises and individual sets.
      </p>


      <form
        className="session-form"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="session-name">
            Workout Name
          </label>

          <input
            id="session-name"
            type="text"
            placeholder="Push Day"
            value={sessionName}
            onChange={(event) =>
              setSessionName(
                event.target.value
              )
            }
          />
        </div>


        {exercises.map(
          (exercise, exerciseIndex) => (
            <section
              className="exercise-editor"
              key={exerciseIndex}
            >
              <div className="exercise-header">
                <h3>
                  Exercise {exerciseIndex + 1}
                </h3>

                <button
                  type="button"
                  className="secondary-button"
                  disabled={
                    exercises.length === 1
                  }
                  onClick={() =>
                    removeExercise(
                      exerciseIndex
                    )
                  }
                >
                  Remove Exercise
                </button>
              </div>


              <div>
                <label
                  htmlFor={
                    `exercise-${exerciseIndex}`
                  }
                >
                  Exercise Name
                </label>

                <input
                  id={
                    `exercise-${exerciseIndex}`
                  }
                  type="text"
                  placeholder="Bench Press"
                  value={
                    exercise.exercise
                  }
                  onChange={(event) =>
                    updateExerciseName(
                      exerciseIndex,
                      event.target.value
                    )
                  }
                />
              </div>


              <div className="sets-list">
                {exercise.sets.map(
                  (
                    workoutSet,
                    setIndex
                  ) => (
                    <div
                      className="set-row"
                      key={setIndex}
                    >
                      <span className="set-number">
                        Set {setIndex + 1}
                      </span>


                      <div>
                        <label
                          htmlFor={
                            `weight-${exerciseIndex}-${setIndex}`
                          }
                        >
                          Weight
                        </label>

                        <input
                          id={
                            `weight-${exerciseIndex}-${setIndex}`
                          }
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="185"
                          value={
                            workoutSet.weight
                          }
                          onChange={(event) =>
                            updateSetField(
                              exerciseIndex,
                              setIndex,
                              "weight",
                              event.target.value
                            )
                          }
                        />
                      </div>


                      <div>
                        <label
                          htmlFor={
                            `reps-${exerciseIndex}-${setIndex}`
                          }
                        >
                          Reps
                        </label>

                        <input
                          id={
                            `reps-${exerciseIndex}-${setIndex}`
                          }
                          type="number"
                          min="1"
                          placeholder="8"
                          value={
                            workoutSet.reps
                          }
                          onChange={(event) =>
                            updateSetField(
                              exerciseIndex,
                              setIndex,
                              "reps",
                              event.target.value
                            )
                          }
                        />
                      </div>


                      <div>
                        <label
                          htmlFor={
                            `rpe-${exerciseIndex}-${setIndex}`
                          }
                        >
                          RPE
                        </label>

                        <input
                          id={
                            `rpe-${exerciseIndex}-${setIndex}`
                          }
                          type="number"
                          min="1"
                          max="10"
                          step="0.5"
                          placeholder="8"
                          value={
                            workoutSet.rpe
                          }
                          onChange={(event) =>
                            updateSetField(
                              exerciseIndex,
                              setIndex,
                              "rpe",
                              event.target.value
                            )
                          }
                        />
                      </div>


                      <button
                        type="button"
                        className="secondary-button"
                        disabled={
                          exercise.sets.length ===
                          1
                        }
                        onClick={() =>
                          removeSet(
                            exerciseIndex,
                            setIndex
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
              </div>


              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  addSet(exerciseIndex)
                }
              >
                + Add Set
              </button>
            </section>
          )
        )}


        <button
          type="button"
          className="secondary-button"
          onClick={addExercise}
        >
          + Add Exercise
        </button>


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : "Save Workout"}
        </button>
      </form>


      {savedSession && (
        <section className="success-card">
          <h3>Workout Saved</h3>

          <h4>{savedSession.name}</h4>

          <p>
            {savedSession.exercises.length}{" "}
            exercise
            {savedSession.exercises.length ===
            1
              ? ""
              : "s"}
          </p>

          {savedSession.exercises.map(
            (exercise) => (
              <div key={exercise.id}>
                <strong>
                  {exercise.exercise}
                </strong>

                <p>
                  {exercise.sets.length} set
                  {exercise.sets.length === 1
                    ? ""
                    : "s"}
                </p>
              </div>
            )
          )}

          {recommendations.length > 0 && (
            <section>
              <h3>
                Next Session Recommendations
              </h3>

              {recommendations.map(
                (recommendation) => (
                  <div
                    key={
                      recommendation.exercise
                    }
                  >
                    <h4>
                      {recommendation.exercise}
                    </h4>

                    <p>
                      Current Top Set:{" "}
                      {
                        recommendation.current_weight
                      }{" "}
                      lb × {recommendation.reps}
                    </p>

                    <p>
                      Recommended Weight:{" "}
                      {
                        recommendation
                          .recommended_weight
                      }{" "}
                      lb
                    </p>

                    <p>
                      {recommendation.reason}
                    </p>
                  </div>
                )
              )}
            </section>
          )}
        </section>
      )}
    </main>
  );
}


export default LogWorkoutPage;