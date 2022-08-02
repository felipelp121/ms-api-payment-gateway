import { NextFunction, Request, Response } from "express";
export async function errorHandlerRoute(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error.message === "400") {
    res.status(400).send({ message: "invalid syntax" });
  } else if (error.message === "401") {
    res.status(401).send({ message: "need a valid auth token" });
  } else if (error.message === "406") {
    res.status(406).send({ message: "data not found" });
  } else if (error.message === "incorrect email or password") {
    res.status(200).send({ message: error.message });
  } else if (
    error.message.includes(
      "Unique constraint failed on the fields: (`document`)",
    )
  ) {
    res.status(400).send({ message: "document already exist" });
  } else if (
    error.message.includes(
      "Unique constraint failed on the fields: (`email`)",
    )
  ) {
    res.status(400).send({ message: "email already exist" });
  } else {
    console.log(error.name); //change for production
    res.status(500).send({ message: error.message }); //change for production
  }
}
