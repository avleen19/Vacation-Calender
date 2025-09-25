const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const holidayRoutes = require("./routes/holidayRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", holidayRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
