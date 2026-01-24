require("dotenv").config();
const express = require("express");
const playerRoutes = require("./player");
const authRoutes = require("./authorization");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/player", playerRoutes);
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
