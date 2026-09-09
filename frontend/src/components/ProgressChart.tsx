import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Workout } from "../types/workout";


interface ProgressChartProps {
  workouts: Workout[];
  exercise: string;
}


function ProgressChart({
  workouts,
  exercise,
}: ProgressChartProps) {
  const chartData = workouts
    .filter(
      (workout) =>
        workout.exercise.trim().toLowerCase() ===
        exercise.trim().toLowerCase()
    )
    .sort(
      (firstWorkout, secondWorkout) =>
        new Date(firstWorkout.created_at).getTime() -
        new Date(secondWorkout.created_at).getTime()
    )
    .map((workout) => ({
      date: new Date(
        workout.created_at
      ).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),

      estimated1RM: workout.estimated_1rm,
    }));


  if (chartData.length === 0) {
    return <p>No progress data available.</p>;
  }


  return (
    <div className="progress-chart">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis
            domain={["auto", "auto"]}
            unit=" lb"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="estimated1RM"
            name="Estimated 1RM"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


export default ProgressChart;