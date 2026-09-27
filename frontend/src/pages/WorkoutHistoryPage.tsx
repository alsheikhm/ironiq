import {
  useEffect,
  useState,
} from "react";

import {
  deleteSession,
  getSessions,
} from "../api/sessions";

import type {
  WorkoutSession,
} from "../types/session";


function calculateSessionVolume(
  session: WorkoutSession
): number {
  return session.exercises.reduce(
    (sessionTotal, exercise) =>
      sessionTotal +
      exercise.sets.reduce(
        (exerciseTotal, workoutSet) =>
          exerciseTotal +
          workoutSet.weight *
            workoutSet.reps,
        0
      ),
    0
  );
}


function WorkoutHistoryPage() {
  const [sessions, setSessions] =
    useState<WorkoutSession[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  async function handleDelete(
    sessionId: number
  ) {
    const shouldDelete =
      window.confirm(
        "Are you sure you want to delete this workout session?"
      );

    if (!shouldDelete) {
      return;
    }


    try {
      await deleteSession(sessionId);

      setSessions((currentSessions) =>
        currentSessions.filter(
          (session) =>
            session.id !== sessionId
        )
      );
    } catch {
      setError(
        "Unable to delete workout session."
      );
    }
  }


  useEffect(() => {
    let cancelled = false;


    async function fetchSessions() {
      try {
        const savedSessions =
          await getSessions();

        if (!cancelled) {
          setSessions(savedSessions);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load workout history."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }


    void fetchSessions();


    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <main>
      <h2>Workout History</h2>

      <p>
        Review your previously recorded
        workout sessions.
      </p>


      {isLoading && (
        <p>Loading workouts...</p>
      )}


      {error && (
        <p className="error-message">
          {error}
        </p>
      )}


      {!isLoading &&
        !error &&
        sessions.length === 0 && (
          <p>
            No workout sessions recorded yet.
          </p>
        )}


      {!isLoading &&
        sessions.map((session) => (
          <section
            key={session.id}
            className="workout-card"
          >
            <div className="workout-header">
              <div>
                <h3>{session.name}</h3>

                <p>
                  {new Date(
                    session.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                className="danger-button"
                onClick={() =>
                  handleDelete(session.id)
                }
              >
                Delete Workout
              </button>
            </div>


            <p>
              Total Volume:{" "}
              {calculateSessionVolume(
                session
              ).toLocaleString()}{" "}
              lb
            </p>


            {session.exercises.map(
              (exercise) => (
                <div
                  className="history-exercise"
                  key={exercise.id}
                >
                  <h4>
                    {exercise.exercise}
                  </h4>

                  <div className="history-sets">
                    {exercise.sets.map(
                      (workoutSet) => (
                        <div
                          className="history-set"
                          key={workoutSet.id}
                        >
                          <span>
                            Set{" "}
                            {
                              workoutSet.set_number
                            }
                          </span>

                          <span>
                            {workoutSet.weight} lb
                          </span>

                          <span>
                            {workoutSet.reps} reps
                          </span>

                          <span>
                            RPE{" "}
                            {workoutSet.rpe}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </section>
        ))}
    </main>
  );
}


export default WorkoutHistoryPage;