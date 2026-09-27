import {
  useEffect,
  useState,
} from "react";

import {
  getAnalyticsSummary,
} from "../api/analytics";

import {
  getSessions,
} from "../api/sessions";

import MetricCard from "../components/MetricCard";
import ProgressChart from "../components/ProgressChart";

import type {
  AnalyticsSummary,
} from "../types/analytics";

import type {
  WorkoutSession,
} from "../types/session";


function DashboardPage() {
  const [summary, setSummary] =
    useState<AnalyticsSummary | null>(
      null
    );

  const [sessions, setSessions] =
    useState<WorkoutSession[]>([]);

  const [
    selectedExercise,
    setSelectedExercise,
  ] = useState("");

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
          savedSessions,
        ] = await Promise.all([
          getAnalyticsSummary(),
          getSessions(),
        ]);


        if (!cancelled) {
          setSummary(analytics);
          setSessions(savedSessions);

          const firstExercise =
            savedSessions
              .flatMap(
                (session) =>
                  session.exercises
              )
              .at(0);


          if (firstExercise) {
            setSelectedExercise(
              firstExercise.exercise
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
      sessions.flatMap(
        (session) =>
          session.exercises.map(
            (exercise) =>
              exercise.exercise
          )
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


  if (
    error ||
    summary === null
  ) {
    return (
      <main>
        <h2>Dashboard</h2>

        <p>
          {error ||
            "Dashboard data is unavailable."}
        </p>
      </main>
    );
  }


  return (
    <main>
      <h2>Dashboard</h2>

      <p>
        Track your workouts,
        strength progress, and
        training performance.
      </p>


      <div className="metrics-grid">
        <MetricCard
          title="Total Workouts"
          value={
            summary.total_workouts
          }
        />

        <MetricCard
          title="Workouts This Week"
          value={
            summary.workouts_this_week
          }
        />

        <MetricCard
          title="Weekly Training Volume"
          value={
            `${summary.weekly_volume
              .toLocaleString()} lb`
          }
        />

        <MetricCard
          title="Best Estimated 1RM"
          value={
            summary.best_estimated_1rm ===
            null
              ? "No data yet"
              : `${summary
                  .best_estimated_1rm
                  .toFixed(1)} lb`
          }
        />
      </div>


      <section>
        <h3>Strength Progress</h3>

        {exerciseNames.length === 0 ? (
          <p>
            Log workouts to begin
            tracking your progress.
          </p>
        ) : (
          <>
            <label
              htmlFor="exercise-select"
            >
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
              {exerciseNames.map(
                (exercise) => (
                  <option
                    key={exercise}
                    value={exercise}
                  >
                    {exercise}
                  </option>
                )
              )}
            </select>


            <ProgressChart
              sessions={sessions}
              exercise={selectedExercise}
            />
          </>
        )}
      </section>


      <section>
        <h3>
          Current Personal Records
        </h3>

        {summary.personal_records
          .length === 0 ? (
          <p>
            No personal records yet.
          </p>
        ) : (
          summary.personal_records.map(
            (record) => (
              <div
                key={record.exercise}
              >
                <h4>
                  {record.exercise}
                </h4>

                <p>
                  {record.weight} lb ×{" "}
                  {record.reps} reps
                </p>

                <p>
                  Estimated 1RM:{" "}
                  {record
                    .estimated_1rm
                    .toFixed(1)}{" "}
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