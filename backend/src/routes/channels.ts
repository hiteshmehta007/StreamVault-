import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Channels API endpoint' });
});

export default router;