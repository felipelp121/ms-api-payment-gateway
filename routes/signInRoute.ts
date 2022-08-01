import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { signInDTO } from "../dto/signInDTO";
dotenv.config();
export async function signInRoute(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body: signInDTO = req.body;
  if (
    !(
      body.email, body.password
    )
  ) {
    throw new Error("400");
  }

  const email = body.email;
  const password = body.password;

  const prisma = new PrismaClient();
  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
  console.log(user);
  if (!user) {
    throw new Error("incorrect email or password");
  }
  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("incorrect email or password");
  }
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("500");
  }
  const token = sign({ id: user.id }, secret, {
    algorithm: "HS256",
    expiresIn: 24 * 60 * 60,
  });

  res.status(200).send({ message: "success", token: token });
}
