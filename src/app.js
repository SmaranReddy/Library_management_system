import express from 'express';
import bookRoutes from './routes/bookRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route mounting
app.use('/api/books', bookRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/students', studentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
