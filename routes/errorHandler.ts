import { NextFunction, Request, Response } from "express";
export async function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error.message === "400") {
    res.status(400).send({ "message": "invalid syntax" });
  } else if (
    error.message.includes(
      "Unique constraint failed on the fields: (`document`)",
    )
  ) {
    res.status(400).send({ "message": "document already exist" });
  } else if (
    error.message.includes(
      "Unique constraint failed on the fields: (`email`)",
    )
  ) {
    res.status(400).send({ "message": "email already exist" });
  } else {
    console.log(error.name);
    res.status(500).send({ "message": error.message });
  }
}
