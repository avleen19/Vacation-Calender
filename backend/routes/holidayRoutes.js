const express = require("express");
const router = express.Router();
const { getHolidays } = require("../controllers/holidayController");

router.get("/holidays", getHolidays);

module.exports = router;
