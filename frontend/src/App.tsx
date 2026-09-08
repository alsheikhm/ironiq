import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LogWorkoutPage from "./pages/LogWorkoutPage";
import WorkoutHistoryPage from "./pages/WorkoutHistoryPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workouts/new" element={<LogWorkoutPage />} />
        <Route
          path="/workouts/history"
          element={<WorkoutHistoryPage />}
        />
      </Routes>
    </>
  );
}

export default App;