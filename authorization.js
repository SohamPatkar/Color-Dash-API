const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const supabase = require("./supabase");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("players")
      .insert([{ name: username, score: 0, hashedpassword: hashedPassword }]);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    res.status(201).send({ message: "User created successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("name", username);

  if (data.length === 0) {
    return res.json({ message: "Invalid username or password" });
  }

  if (error) {
    return res.json({ message: error.message });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    data[0].hashedpassword,
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        id: data[0].id,
        username: data[0].name,
        password: hashPassword,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } else {
    return res.json({ message: "Invalid password" });
  }
});

module.exports = router;
