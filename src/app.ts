import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth";
import textRoutes from "./routes/text";
import userRoutes from "./routes/user";
import resultRoutes from "./routes/result";

const app = express();

app.use(
  cors({
    origin: "https://speed-type-frontend.render.com",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/texts", textRoutes);
app.use("/users", userRoutes);
app.use("/results", resultRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  let errorMessage = "An unknown error occured";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

export default app;
