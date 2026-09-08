import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>IronIQ</h1>

      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/workouts/new">Log Workout</Link>
        <Link to="/workouts/history">History</Link>
      </div>
    </nav>
  );
}

export default Navbar;