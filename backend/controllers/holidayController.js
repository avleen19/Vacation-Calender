const { fetchHolidaysFromAPI } = require("../services/holidayService");

exports.getHolidays = async (req, res) => {
  try {
    const { country, start, end } = req.query;

    if (!country) {
      return res.status(400).json({ message: "Country code is required" });
    }

    const holidays = await fetchHolidaysFromAPI(country, start, end);
    res.json(holidays);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", holidays: [] });
  }
};
