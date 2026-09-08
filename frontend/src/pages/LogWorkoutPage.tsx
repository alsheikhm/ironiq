function LogWorkoutPage() {
  return (
    <main>
      <h2>Log Workout</h2>

      <form>
        <div>
          <label>Exercise</label>
          <input type="text" placeholder="Bench Press" />
        </div>

        <div>
          <label>Weight</label>
          <input type="number" placeholder="185" />
        </div>

        <div>
          <label>Reps</label>
          <input type="number" placeholder="8" />
        </div>

        <div>
          <label>RPE</label>
          <input type="number" placeholder="8" />
        </div>

        <button type="submit">Add Workout</button>
      </form>
    </main>
  );
}

export default LogWorkoutPage;