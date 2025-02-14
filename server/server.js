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
    if (!username || !Number.isInteger(score) || score < 1) {
      return res.status(400).json({ error: "Invalid data" });
    }

    score = Math.min(score, 99999999);
    level = Math.min(level, 9999);

    const updatedEntry = await prisma.leaderboard.upsert({
      where: { username },
      update: { score, level, createdAt: new Date() },
      create: { username, score, level },
    });

    res.status(201).json(updatedEntry);
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
