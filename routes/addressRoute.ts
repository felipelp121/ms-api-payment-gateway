import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { jwtDecode } from "../services/mod";
import { PrismaClient } from "@prisma/client";
import { AddressDTO, DeleteAddressDTO } from "../dto/mod";

export async function createAddressRoute(
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
  const body: AddressDTO = req.body;
  if (
    !(body.city,
      body.complement,
      body.country,
      body.locality,
      body.number,
      body.postal_code,
      body.region,
      body.region_code,
      body.street)
  ) {
    throw new Error("400");
  }

  const {
    city,
    complement,
    country,
    locality,
    number,
    postal_code,
    region,
    region_code,
    street,
  } = body;

  const prisma = new PrismaClient();
  const address = await prisma.address.create({
    data: {
      user_id: payload.id,
      city: city,
      complement: complement,
      country: country,
      locality: locality,
      number: number,
      postal_code: postal_code,
      region: region,
      region_code: region_code,
      street: street,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  await prisma.$disconnect();
  if (address) {
    res.status(201).send({ message: "success" });
  } else {
    res.status(500).send({ message: "failed to create" });
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
  const address = await prisma.address.findMany({
    where: {
      user_id: payload.id,
    },
  });
  await prisma.$disconnect();
  if (!address) {
    throw new Error("406");
  }

  res.status(200).send({
    message: "success",
    address: address,
  });
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
  const body: DeleteAddressDTO = req.body;
  const addressId = body.id;
  const prisma = new PrismaClient();
  const address = await prisma.address.deleteMany({
    where: {
      id: addressId,
      user_id: payload.id,
    },
  });
  await prisma.$disconnect();
  if (!address) {
    throw new Error("406");
  }

  res.status(200).send({
    message: "success",
  });
}
