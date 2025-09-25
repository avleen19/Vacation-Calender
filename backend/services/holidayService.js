const axios = require("axios");

exports.fetchHolidaysFromAPI = async (country, start, end) => {
  try {
    const year = new Date(start).getFullYear(); // extract year from start date

   
    const response = await axios.get("https://calendarific.com/api/v2/holidays", {
  params: {
    api_key: process.env.CALENDARIFIC_KEY,
    country: country,
    year: year
  }
});
// console.log(response.data);
    // Map holidays into simple format
    const holidays = response.data.response.holidays.map(h => ({
      name: h.name,
      date: h.date.iso,
      type: h.type.join(", ")
    }));

    // Filter by start and end date
    const filtered = holidays.filter(h => h.date >= start && h.date <= end);

    return filtered;

  } catch (err) {
    console.error("Error fetching holidays:", err.message);
    return [];
  }
};
