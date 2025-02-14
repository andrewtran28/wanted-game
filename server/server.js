require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] }));
app.use(express.json());

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
    let { username, score, level } = req.body;

    if (!username || typeof username !== "string" || username.length > 12) {
      return res.status(400).json({ error: "Invalid username" });
    }
    if (!Number.isInteger(score) || score < 1 || score > 999999999) {
      return res.status(400).json({ error: "Invalid score" });
    }
    if (!Number.isInteger(level) || level < 1 || level > 9999) {
      return res.status(400).json({ error: "Invalid level" });
    }

    const updatedEntry = await prisma.leaderboard.upsert({
      where: { username },
      update: {
        score: { set: score, where: { score: { lt: score } } },
        level: { set: level, where: { score: { lt: score } } },
        createdAt: { set: new Date(), where: { score: { lt: score } } },
      },
      create: { username, score, level },
    });

    if (updatedEntry.score !== score) {
      return res.status(200).json({ message: "Score not high enough to update" });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on: http://localhost:${PORT}`));
