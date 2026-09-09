import { useEffect, useState } from "react";

import { getAnalyticsSummary } from "../api/analytics";
import type { AnalyticsSummary } from "../types/analytics";


function DashboardPage() {
  const [summary, setSummary] =
    useState<AnalyticsSummary | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    async function fetchSummary() {
      try {
        const analytics =
          await getAnalyticsSummary();

        if (!cancelled) {
          setSummary(analytics);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load dashboard analytics."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchSummary();

    return () => {
      cancelled = true;
    };
  }, []);


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
          {error || "Analytics are unavailable."}
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