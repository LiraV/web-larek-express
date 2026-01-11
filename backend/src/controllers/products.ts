import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find({});
    res.status(200).send({
      items: products,
      total: products.length,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body as {
      title: string;
      image: { fileName: string; originalName: string };
      category: string;
      description?: string;
      price: number | null;
    };

    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    return res.status(201).send(product);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Ошибка валидации'));
    }
    if (err instanceof Error && err.message.includes('E11000')) {
      return next(new ConflictError('Товар уже существует'));
    }
    return next(err);
  }
};
