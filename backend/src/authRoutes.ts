import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "./db";
import { validateResource } from "./validate";
import { Router, Request, Response } from "express";
import { authRequestSchema } from "./schemas";

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// POST Create a new user
router.post(
  "/register",
  validateResource(authRequestSchema as any),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // check if user already exists
      const userCheck = await pool.query(
        `SELECT email FROM users WHERE email = $1`,
        [email]
      );
      if (userCheck.rows.length > 0) {
        return res.status(409).json({ error: "email already exists." });
      }

      // hash the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // insert
      const result = await pool.query(
        `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role`,
        [email, passwordHash]
      );

      res.status(201).json({
        message: "User registered successfully!",
        user: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// POST Log-in /api/auth/login
router.post(
  "/login",
  validateResource(authRequestSchema as any),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // find the user
      const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // compare or check whether the login password is correct
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (isValidPassword) {
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.json({ message: "Login successful", token });
      }

      res.status(401).json({ error: "Invalid email or password." });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// POST Logout /api/auth/logout
router.post(
    "/logout",
    async (req: Request, res: Response) => {
        res.json({ message: "Logged out successfully. Please remove the token from your client." });
    }
);

export default router;