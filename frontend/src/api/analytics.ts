import type { AnalyticsSummary } from "../types/analytics";


const API_BASE_URL = "http://127.0.0.1:8000";


export async function getAnalyticsSummary():
  Promise<AnalyticsSummary> {
  const response = await fetch(
    `${API_BASE_URL}/api/analytics/summary`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load workout analytics."
    );
  }

  return response.json();
}