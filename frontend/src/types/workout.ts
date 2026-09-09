export interface WorkoutCreate {
  exercise: string;
  sets: number;
  weight: number;
  reps: number;
  rpe: number;
}

export interface Workout extends WorkoutCreate {
  id: number;
  created_at: string;
}