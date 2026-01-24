const express = require("express");
const supabase = require("./supabase");
const router = express.Router();
const authMiddleware = require("./middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("players").select("*");

    res.json(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.post("/submit-score", async (req, res) => {
  const { name, score } = req.body;

  try {
    const {data, error} = await supabase.from("players").insert([{name, score}]);
    
    res.json({
      message: "Score submitted successfully",
    })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.put("/update-score/:id", authMiddleware, async (req, res) => {
  const userIdFromToken = req.user.id;
  const { id } = req.params;
  const { score } = req.body;

  if(userIdFromToken != id){
    return res.status(403).json({ message: "Forbidden: You can only update your own score" });
  }

  try{
    const { data, error} = await supabase.from("players").update({ score }).eq("id", id);

    res.json({
      message: "Score updated successfully",
      score: data
    })
  }catch(err){
    res.status(500).send({ message: err.message });
  }
});

router.get("/leaderboard", async (req, res) => {
  const quantity = req.query.quantity || 10;
  let quantityToShow = parseInt(quantity);

  try {
    const { data, error } = await supabase.from("players").select("*").limit(quantityToShow);
    
    res.json(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;