import type { Workout, WorkoutCreate } from "../types/workout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function createWorkout(
  workout: WorkoutCreate
): Promise<Workout> {
  const response = await fetch(`${API_BASE_URL}/api/workouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  });

  if (!response.ok) {
    throw new Error("Failed to save workout.");
  }

  return response.json();
}


export async function getWorkouts(): Promise<Workout[]> {
  const response = await fetch(`${API_BASE_URL}/api/workouts`);

  if (!response.ok) {
    throw new Error("Failed to load workouts.");
  }

  return response.json();
}


export async function deleteWorkout(workoutId: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/workouts/${workoutId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete workout.");
  }
}