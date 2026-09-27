import type {
  WorkoutSession,
  WorkoutSessionCreate,
} from "../types/session";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


export async function createSession(
  session: WorkoutSessionCreate
): Promise<WorkoutSession> {
  const response = await fetch(
    `${API_BASE_URL}/api/sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to save workout session."
    );
  }

  return response.json();
}


export async function getSessions():
  Promise<WorkoutSession[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/sessions`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load workout sessions."
    );
  }

  return response.json();
}


export async function deleteSession(
  sessionId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/sessions/${sessionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete workout session."
    );
  }
}