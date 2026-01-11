import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total } = req.body;

    const products = await Product.find({ _id: { $in: items } });
    if (products.length !== items.length) {
      return next(new BadRequestError('Некорректные данные'));
    }

    const noPrice = products.find((p) => p.price === null);
    if (noPrice) {
      return next(new BadRequestError('Некорректные данные'));
    }

    const sum = products.reduce((acc, p) => acc + (p.price as number), 0);
    if (sum !== total) {
      return next(new BadRequestError('Некорректные данные'));
    }

    return res.status(200).send({
      id: faker.string.uuid(),
      total: sum,
    });
  } catch (e) {
    return next(e);
  }
};

export default createOrder;
