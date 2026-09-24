import express from 'express';
import serviceRoutes from './serviceRoutes';
import dotenv from 'dotenv';
import authRoutes from './authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/services', serviceRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Service API server running on http://localhost:${PORT}`);
});