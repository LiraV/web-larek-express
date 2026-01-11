import AppError from "./app-error";

export default class ConflictError extends AppError {
  constructor(message = "Ресурс уже существует") {
    super(message, 409);
  }
}