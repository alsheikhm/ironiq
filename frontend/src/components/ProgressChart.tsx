import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  WorkoutSession,
} from "../types/session";


interface ProgressChartProps {
  sessions: WorkoutSession[];
  exercise: string;
}


function ProgressChart({
  sessions,
  exercise,
}: ProgressChartProps) {
  const normalizedExercise =
    exercise.trim().toLowerCase();


  const chartData = sessions
    .flatMap((session) => {
      const matchingExercise =
        session.exercises.find(
          (workoutExercise) =>
            workoutExercise.exercise
              .trim()
              .toLowerCase() ===
            normalizedExercise
        );


      if (
        !matchingExercise ||
        matchingExercise.sets.length === 0
      ) {
        return [];
      }


      const bestSet =
        matchingExercise.sets.reduce(
          (best, current) =>
            current.estimated_1rm >
            best.estimated_1rm
              ? current
              : best
        );


      return [
        {
          timestamp: new Date(
            session.created_at
          ).getTime(),

          date: new Date(
            session.created_at
          ).toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric",
            }
          ),

          estimated1RM:
            bestSet.estimated_1rm,
        },
      ];
    })
    .sort(
      (firstPoint, secondPoint) =>
        firstPoint.timestamp -
        secondPoint.timestamp
    );


  if (chartData.length === 0) {
    return (
      <p>No progress data available.</p>
    );
  }


  return (
    <div className="progress-chart">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

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