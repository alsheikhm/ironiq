import type { Recommendation } from "../types/recommendation";


const API_BASE_URL = "http://127.0.0.1:8000";


export async function getRecommendation(
  exercise: string
): Promise<Recommendation> {
  const encodedExercise =
    encodeURIComponent(exercise);

  const response = await fetch(
    `${API_BASE_URL}/api/recommendations/${encodedExercise}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load recommendation."
    );
  }

  return response.json();
}