import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { jwtDecode } from "../services/mod";
import { PrismaClient } from "@prisma/client";
import { CartDTO } from "../dto/mod";

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

  const prisma = new PrismaClient();
  const cart = await prisma.carts.create({
    data: {
      user_id: payload.id,
      product_id: product_id,
      amount: amount,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  await prisma.$disconnect();
  if (cart) {
    res.status(201).send({ message: "success" });
  } else {
    res.status(500).send({ message: "failed to create" });
  }
}

export async function deleteCartRoute(
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
      body.product_id
    )
  ) {
    throw new Error("400");
  }

  const product_id = body.product_id;

  const prisma = new PrismaClient();
  const cart = await prisma.carts.deleteMany({
    where: {
      user_id: payload.id,
      product_id: product_id,
    },
  });
  await prisma.$disconnect();
  if (cart) {
    res.status(200).send({ message: "success" });
  } else {
    res.status(500).send({ message: "failed to delete" });
  }
}

export async function getCartRoute(
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

  const prisma = new PrismaClient();
  const cart = await prisma.carts.findMany({
    where: {
      user_id: payload.id,
    },
    select: {
      amount: true,
      product: {
        select: {
          name: true,
          value: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  if (!cart) {
    throw new Error("406");
  }
  let totalValue = 0;
  cart.map((element) => {
    totalValue += element.product.value * element.amount;
  });

  res.status(200).send({
    message: "success",
    cart: cart,
    total_value: totalValue,
  });
}
