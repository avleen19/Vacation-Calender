import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export async function fetchHolidays({ country, start, end }) {
  const params = { country };
  if (start) params.start = start;
  if (end) params.end = end;

  const res = await API.get("/api/holidays", { params });
  return res.data;
}
