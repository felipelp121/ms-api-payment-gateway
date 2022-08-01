import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { verify } from "jsonwebtoken";
import { jwtDecode } from "../services/mod";
import { PrismaClient } from "@prisma/client";
import { CartDTO } from "../dto/mod";
dotenv.config();

export async function createCartRoute(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("401");
  }
  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    throw new Error("500");
  }
  const isAuth = verify(token, tokenSecret);

  if (!isAuth) {
    throw new Error("401");
  }
  const payload = jwtDecode(token);
  if (!payload.id) {
    throw new Error("401");
  }
  const body: CartDTO = req.body;
  if (
    !(
      body.product_id, body.amount
    )
  ) {
    throw new Error("400");
  }

  const { product_id, amount } = body;
  console.log(amount);
  const prisma = new PrismaClient();
  const cart = await prisma.cart.create({
    data: {
      user_id: payload.id,
      product_id: product_id,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  if (cart) {
    res.status(201).send({ message: "success" });
  } else {
    res.status(500).send({ message: "failed to create" });
  }
}
