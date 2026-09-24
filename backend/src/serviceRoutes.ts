import { Router, Request, Response } from "express";
import { pool } from "./db";
import { validateResource } from "./validate";
import { updateServiceSchema, deleteServiceSchema, createServiceSchema } from "./schemas";
import { authenticateToken } from "./authMiddleware";

const router = Router();

//GET
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  //access the db
  try {
    const result = await pool.query("SELECT * FROM microservices ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

//POST
router.post("/", authenticateToken, validateResource(createServiceSchema as any), async (req: Request, res: Response) => {
  //retrieve the specific properties from the request's body
  const { name, endpointUrl, environment, status, version } = req.body;
  const ownerEmail = typeof req.user === "object" && req.user ? req.user.email : null;
  try {
    const result = await pool.query(
      `INSERT INTO microservices (name, "endpointUrl", environment, status, version, "ownerEmail")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [name, endpointUrl ?? null, environment ?? null, status ?? null, version ?? null, ownerEmail]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH
router.patch(
  "/:id",
  authenticateToken,
  validateResource(updateServiceSchema as any),
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { name, endpointUrl, environment, status, version } = req.body;

    try {
      const updates: string[] = [];
      const values: string[] = [];

      const addUpdate = (column: string, value: string) => {
        values.push(value);
        updates.push(`${column} = $${values.length}`);
      };

      if (name !== undefined) addUpdate("name", name);
      if (endpointUrl !== undefined) addUpdate('"endpointUrl"', endpointUrl);
      if (environment !== undefined) addUpdate("environment", environment);
      if (status !== undefined) addUpdate("status", status);
      if (version !== undefined) addUpdate("version", version);

      if (updates.length === 0) {
        return res.status(400).json({ error: "Provide at least one field to update." });
      }

      values.push(id);
      const query = `UPDATE microservices SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`;
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Microservice not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

//DELETE
router.delete('/:id', authenticateToken, validateResource(deleteServiceSchema as any), async(req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM microservices WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Microservice not found' });
    }
    res.json({ message: 'Microservice deleted successfully', service: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
