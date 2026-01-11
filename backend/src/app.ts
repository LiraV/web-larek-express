import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRouter from "./routes/products";
import orderRouter from "./routes/orders";
import path from "path";
import errorHandler from "./middlewares/error-handler";
import NotFoundError from "./errors/not-found-error";
import { errorLogger, requestLogger } from "./middlewares/logger";
import { errors } from "celebrate";

mongoose.connect("mongodb://127.0.0.1:27017/weblarek");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(requestLogger);

app.use("/product", productRouter);
app.use("/order", orderRouter);

app.use(errorLogger);

app.use(() => {
  throw new NotFoundError("Маршрут не найден");
});
app.use(errors());
app.use(errorHandler);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
