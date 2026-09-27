export interface WorkoutSetCreate {
  weight: number;
  reps: number;
  rpe: number;
}

export interface WorkoutExerciseCreate {
  exercise: string;
  sets: WorkoutSetCreate[];
}

export interface WorkoutSessionCreate {
  name: string;
  exercises: WorkoutExerciseCreate[];
}


export interface WorkoutSet
  extends WorkoutSetCreate {
  id: number;
  set_number: number;
  training_volume: number;
  estimated_1rm: number;
}

export interface WorkoutExercise {
  id: number;
  exercise: string;
  exercise_order: number;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: number;
  name: string;
  created_at: string;
  exercises: WorkoutExercise[];
}