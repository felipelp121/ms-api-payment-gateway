import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { signUpDTO } from "../dto/signUpDTO";
dotenv.config();
export async function signUpRoute(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body: signUpDTO = req.body;
  if (
    !(
      body.name,
        body.email,
        body.password,
        body.type_document,
        body.document,
        body.birthdate
    )
  ) {
    throw new Error("400");
  }

  const name = body.name;
  const email = body.email;
  const password = body.password;
  const type_document = body.type_document;
  const document = body.document;
  const birthdate = new Date(body.birthdate); //new Date add format

  const salt = bcrypt.genSaltSync(8);
  const passwordHash = bcrypt.hashSync(password, salt);

  const prisma = new PrismaClient();
  const user = await prisma.users.create({
    data: {
      name: name,
      email: email,
      password: passwordHash,
      type_document: type_document,
      document: document,
      birthdate: birthdate,
    },
  });
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("500");
  }
  const token = sign({ id: user.id }, secret, {
    algorithm: "HS256",
    expiresIn: 24 * 60 * 60,
  });

  res.status(201).send({ message: "success", token: token });
}
