import React from "react";
import VacationCalendar from "./components/VacationCalendar";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Vacation Calendar</h1>
      </header>
      <main>
        <VacationCalendar />
      </main>
    </div>
  );
}

export default App;
