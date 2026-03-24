import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get products with optional filtering (category, search, sorting)
router.get('/', async (req, res) => {
  try {
    const { type, search, getLimit } = req.query;
    let whereClause: any = {};
    
    if (type) {
      whereClause.type = String(type).toUpperCase();
    }
    if (search) {
      whereClause.name = {
        contains: String(search)
      };
    }

    const queryOptions: any = {
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    };
    
    if (getLimit) {
      queryOptions.take = parseInt(String(getLimit));
    }

    const products = await prisma.product.findMany(queryOptions);

    // Calculate average rating dynamically
    const productsWithRating = products.map((p: any) => {
      const avgRating = p.reviews.length > 0 
        ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length 
        : 0;
      return { ...p, reviews: undefined, rating: avgRating, reviewCount: p.reviews.length };
    });

    res.json(productsWithRating);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving products' });
  }
});

// Get single product by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving product' });
  }
});

export default router;
