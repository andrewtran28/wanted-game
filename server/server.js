require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: { score: "desc" },
      take: 10,
    });

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/leaderboard", async (req, res) => {
  try {
    const { username, score, level } = req.body;

    if (!username || !score || score < 1) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const newEntry = await prisma.leaderboard.create({
      data: { username, level, score },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on: http://localhost:${PORT}`));
