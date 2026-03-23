import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware for auth
const authenticate = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Add a review
router.post('/', authenticate, async (req: any, res: any) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.userId;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        comment
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

export default router;
