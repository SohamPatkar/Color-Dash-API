const bcrypt = require("bcrypt");
const express = require("express");
const supabase = require("./supabase");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { data, error } = await supabase
      .from("players")
      .insert([{ name: username, score: 0, hashedpassword: hashedPassword }]);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("name", username);

  console.log(data);

  if (error) {
    return res.json({ message: error.message });
  }

  res.json({ message: "Login successful" });
});

module.exports = router;
