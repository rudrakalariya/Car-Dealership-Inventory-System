import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

import authRoutes from './routes/auth.routes';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

import { initDB } from './config/init-db';

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;

  // Initialize DB schema before starting the server
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

export default app;
