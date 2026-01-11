import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  Product.find({})
    .then((products) => {
      res.status(200).send({
        items: products,
        total: products.length,
      });
    })
    .catch(next);
};

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Product.create(req.body)
    .then((product) => {
      res.status(201).send(product);
    })
    .catch((err) => {
      if (err instanceof MongooseError.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'));
      }
      if (err instanceof Error && err.message.includes('E11000')) {
        return next(new ConflictError('Товар уже существует'));
      }
      return next(err);
    });
};
