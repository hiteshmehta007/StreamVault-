import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Live Streams API endpoint' });
});

export default router;