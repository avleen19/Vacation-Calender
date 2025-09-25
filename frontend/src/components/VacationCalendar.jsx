import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchHolidays } from "../services/api";

// Utility: get week start (Monday)
function getWeekStart(dateLike, weekStartsOn = 1) {
  const d = typeof dateLike === "string" ? new Date(dateLike + "T00:00:00") : new Date(dateLike);
  const day = (d.getDay() + 7 - weekStartsOn) % 7;
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start.toISOString().slice(0, 10);
}

export default function VacationCalendar() {
  const calendarRef = useRef();
  const [country, setCountry] = useState("IN");
  const [holidays, setHolidays] = useState([]);
  const [weeksMap, setWeeksMap] = useState({});
  const [viewRange, setViewRange] = useState({ start: null, end: null });

  const countries = [
    { code: "IN", name: "India" },
    { code: "US", name: "USA" },
    { code: "GB", name: "UK" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" }
  ];

  // Load holidays & build week map
  async function loadHolidaysForRange(startStr, endStr, countryCode) {
    if (!countryCode) return;
    try {
      const data = await fetchHolidays({ country: countryCode, start: startStr, end: endStr }) || [];
      setHolidays(data);

      const map = {};
      data.forEach(h => {
        if (h.type.includes("National") || h.type.includes("Public")) {
          const wk = getWeekStart(h.date.slice(0, 10));
          map[wk] = (map[wk] || 0) + 1;
        }
      });
      setWeeksMap(map);
    } catch (err) {
      console.error(err);
      setHolidays([]);
      setWeeksMap({});
    }
  }

  useEffect(() => {
    if (viewRange.start && viewRange.end) {
      loadHolidaysForRange(viewRange.start, viewRange.end, country);
    }
  }, [country, viewRange]);

  function handleDatesSet(info) {
    setViewRange({
      start: info.startStr.slice(0, 10),
      end: info.endStr.slice(0, 10)
    });
  }

  // Highlight full week
  function dayCellClassNames(arg) {
    const dateStr = arg.date.toISOString().slice(0, 10);
    const wk = getWeekStart(dateStr);
    const count = weeksMap[wk] || 0;

    // Apply dark green if 2+ official holidays in the week
    if (!arg.isOther) {
      if (count > 1) return ["week-dark"];
      if (count === 1) return ["week-light"];
    }
    return [];
  }

  const events = holidays.map((h, idx) => ({
    id: idx,
    title: h.name,
    start: h.date.slice(0, 10)
  }));

  return (
    <div className="vacation-container">
      <div className="controls">
        <label>
          Country:{" "}
          <select value={country} onChange={e => setCountry(e.target.value)}>
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </label>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridQuarter"
        }}
        views={{
          dayGridQuarter: {
            type: "dayGrid",
            duration: { months: 3 },
            buttonText: "Quarter"
          }
        }}
        events={events}
        datesSet={handleDatesSet}
        dayCellClassNames={dayCellClassNames}
        height="auto"
      />

      <div className="holiday-list">
        <h2>Holidays ({country})</h2>
        {holidays.length === 0 ? (
          <p>No holidays in this visible range.</p>
        ) : (
          <ul>
            {holidays.map((h, i) => (
              <li key={i}>
                <strong>{h.date.slice(0, 10)}</strong> — {h.name} ({h.type})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
