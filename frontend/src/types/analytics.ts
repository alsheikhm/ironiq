export interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  estimated_1rm: number;
}


export interface AnalyticsSummary {
  total_workouts: number;
  workouts_this_week: number;
  weekly_volume: number;
  best_estimated_1rm: number | null;
  personal_records: PersonalRecord[];
}