import { NavLink } from "react-router-dom";


function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">IronIQ</h1>

      <div className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/workouts/new"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Log Workout
        </NavLink>

        <NavLink
          to="/workouts/history"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          History
        </NavLink>
      </div>
    </nav>
  );
}


export default Navbar;