import {
  useEffect,
  useState,
} from "react";

import { getAnalyticsSummary } from "../api/analytics";
import { getWorkouts } from "../api/workouts";

import ProgressChart from "../components/ProgressChart";

import type { AnalyticsSummary } from "../types/analytics";
import type { Workout } from "../types/workout";


function DashboardPage() {
  const [summary, setSummary] =
    useState<AnalyticsSummary | null>(null);

  const [workouts, setWorkouts] =
    useState<Workout[]>([]);

  const [selectedExercise, setSelectedExercise] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;


    async function fetchDashboardData() {
      try {
        const [
          analytics,
          savedWorkouts,
        ] = await Promise.all([
          getAnalyticsSummary(),
          getWorkouts(),
        ]);


        if (!cancelled) {
          setSummary(analytics);
          setWorkouts(savedWorkouts);

          if (savedWorkouts.length > 0) {
            setSelectedExercise(
              savedWorkouts[0].exercise
            );
          }

          setError("");
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load dashboard data."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }


    void fetchDashboardData();


    return () => {
      cancelled = true;
    };
  }, []);


  const exerciseNames = Array.from(
    new Set(
      workouts.map(
        (workout) => workout.exercise
      )
    )
  ).sort();


  if (isLoading) {
    return (
      <main>
        <h2>Dashboard</h2>
        <p>Loading analytics...</p>
      </main>
    );
  }


  if (error || summary === null) {
    return (
      <main>
        <h2>Dashboard</h2>

        <p>
          {error || "Dashboard data is unavailable."}
        </p>
      </main>
    );
  }


  return (
    <main>
      <h2>Dashboard</h2>

      <p>
        Track your workouts, strength progress,
        and training performance.
      </p>


      <section>
        <h3>Total Workout Entries</h3>

        <p>{summary.total_workouts}</p>
      </section>


      <section>
        <h3>Entries This Week</h3>

        <p>{summary.workouts_this_week}</p>
      </section>


      <section>
        <h3>Weekly Training Volume</h3>

        <p>
          {summary.weekly_volume.toLocaleString()} lb
        </p>
      </section>


      <section>
        <h3>Best Estimated 1RM</h3>

        <p>
          {summary.best_estimated_1rm === null
            ? "No data yet"
            : `${summary.best_estimated_1rm.toFixed(
                1
              )} lb`}
        </p>
      </section>


      <section>
        <h3>Strength Progress</h3>

        {exerciseNames.length === 0 ? (
          <p>
            Log workouts to begin tracking
            your progress.
          </p>
        ) : (
          <>
            <label htmlFor="exercise-select">
              Exercise
            </label>

            <br />

            <select
              id="exercise-select"
              value={selectedExercise}
              onChange={(event) =>
                setSelectedExercise(
                  event.target.value
                )
              }
            >
              {exerciseNames.map((exercise) => (
                <option
                  key={exercise}
                  value={exercise}
                >
                  {exercise}
                </option>
              ))}
            </select>

            <ProgressChart
              workouts={workouts}
              exercise={selectedExercise}
            />
          </>
        )}
      </section>


      <section>
        <h3>Current Personal Records</h3>

        {summary.personal_records.length === 0 ? (
          <p>No personal records yet.</p>
        ) : (
          summary.personal_records.map(
            (record) => (
              <div key={record.exercise}>
                <h4>{record.exercise}</h4>

                <p>
                  {record.weight} lb ×{" "}
                  {record.reps} reps
                </p>

                <p>
                  Estimated 1RM:{" "}
                  {record.estimated_1rm.toFixed(1)}{" "}
                  lb
                </p>
              </div>
            )
          )
        )}
      </section>
    </main>
  );
}


export default DashboardPage;