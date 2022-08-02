import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import superagent from "superagent";
import { verify } from "jsonwebtoken";
import { jwtDecode } from "../services/mod";
import { PrismaClient } from "@prisma/client";
import { ordersDTO } from "../dto/mod";

export async function orderRoute(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
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
    //verificar se cadastrou já um metodo de pagamento
    //   const getPaymentMethod = await prisma.payment_method.findFirst({
    //     where: {
    //       user_id: payload.id,
    //     },
    //   });

    const body: ordersDTO.PaymentMethod = req.body;
    if (
      !((
        body.type,
          body.installments,
          body.capture,
          body.card.number,
          body.card.exp_month,
          body.card.exp_year,
          body.card.security_code,
          body.card.store,
          body.card.holder.name
      ))
    ) {
      throw new Error("400");
    }

    const { type, installments, capture, card } = body;
    const cardNumber = card.number;
    const cardExpMonth = card.exp_month;
    const cardExpYear = card.exp_year;
    const cardSecurityCode = card.security_code;
    const cardHolderName = card.holder.name;
    const cardStore = card.store;

    const customer = await prisma.users.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        name: true,
        email: true,
        document: true,
      },
    });
    const { document, ...spreadCustomer } = { ...customer };
    const items = await prisma.carts.findMany({
      where: {
        user_id: payload.id,
      },
      include: {
        product: true,
      },
    });
    let totalValue = 0;
    const formatedItems = items.map((element: any) => {
      totalValue += element.product.value * element.amount;
      return {
        reference_id: "item-" + element.product.id,
        name: element.product.name,
        quantity: element.amount,
        unit_amount: element.product.value * 100,
      };
    });
    totalValue = totalValue * 100; // value format to pagseguro
    const address = await prisma.address.findFirst({
      where: {
        user_id: payload.id,
      },
      select: {
        street: true,
        number: true,
        complement: true,
        locality: true,
        city: true,
        region_code: true,
        country: true,
        postal_code: true,
      },
    });
    await prisma.$disconnect();
    const { number, postal_code, ...spreadAddress } = { ...address };
    const addresNumber = typeof (number) === "number"
      ? number.toString()
      : "10";
    const addressPostalCode = typeof (postal_code) === "number"
      ? postal_code.toString()
      : "24100200";
    const notificationUrls = ["https://meusite.com/notificacoes"];

    const paymentMethod = {
      type: type,
      installments: installments,
      capture: true,
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        security_code: cardSecurityCode,
        holder: {
          name: cardHolderName,
        },
        store: cardStore,
      },
    };

    const order: any = {
      reference_id: uuidv4(),
      customer: { ...spreadCustomer, tax_id: document },
      items: formatedItems,
      shipping: {
        address: {
          ...spreadAddress,
          number: addresNumber,
          postal_code: addressPostalCode,
        },
      },
      notification_urls: notificationUrls,
      charges: [
        {
          reference_id: uuidv4(),
          description: "Loja Felipe Lopes",
          amount: {
            value: totalValue,
            currency: "BRL",
          },
          payment_method: paymentMethod,
          notification_urls: notificationUrls,
        },
      ],
    };

    const tokenPagseguro = process.env.TOKEN_PAGSEGURO;
    if (tokenPagseguro == undefined) {
      throw new Error("401");
    }
    const response = await superagent
      .post(
        "https://sandbox.api.pagseguro.com/orders",
      )
      .send({ ...order })
      .set("authorization", tokenPagseguro);

    res.status(response.status).send(JSON.parse(response.text));
  } catch (err: any) {
    res.status(400).send({
      status: err.status,
      message: err.text,
      response: err.response,
    });
  }
}

// export async function getOrdersRoute(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   const token = req.headers.authorization;
//   if (!token) {
//     throw new Error("401");
//   }
//   const tokenSecret = process.env.TOKEN_SECRET;
//   if (!tokenSecret) {
//     throw new Error("500");
//   }
//   const isAuth = verify(token, tokenSecret);

//   if (!isAuth) {
//     throw new Error("401");
//   }
//   const payload = jwtDecode(token);
//   if (!payload.id) {
//     throw new Error("401");
//   }

//   const prisma = new PrismaClient();
//   const cart = await prisma.carts.findMany({
//     where: {
//       user_id: payload.id,
//     },
//     include: {
//       product: true,
//     },
//   });
//   if (!cart) {
//     throw new Error("406");
//   }
//   let totalValue = 0;
//   cart.map((element) => {
//     totalValue += element.product.value * element.amount;
//   });

//   res.status(200).send({
//     message: "success",
//     cart: cart,
//     total_value: totalValue,
//   });
// }

// se o payment method tiver como store true, tem que guardar ele no banco.
