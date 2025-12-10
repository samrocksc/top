import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { findUserByAuth0Id } from "./db/userService";
import prisma from "./db/index";
import { auth } from 'express-oauth2-jwt-bearer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// App Configuration
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  auth({
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    audience: process.env.AUDIENCE,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "OK",
      message: "Server is running and database is connected",
    });
  } catch (error: unknown) {
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: (error as Error).message,
    });
  }
});

app.get("/user/:auth0Id", async (req, res) => {
  try {
    const user = await findUserByAuth0Id(req.params.auth0Id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
