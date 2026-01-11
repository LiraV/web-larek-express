import AppError from './app-error';

export default class NotFoundError extends AppError {
  constructor(message = 'Маршрут не найден') {
    super(message, 404);
  }
}
