import dotenv from "dotenv";
import * as routes from "./routes/mod";
import express, { Request, Response } from "express";
require("express-async-errors"); //try to change to import instead require
dotenv.config();
const app = express();
app.use(express.json());

export async function router() {
  app.post(
    "/" + process.env.URL_API + "/sign_up",
    routes.signUpRoute,
  );

  app.post(
    "/" + process.env.URL_API + "/sign_in",
    routes.signInRoute,
  );

  app.route("/" + process.env.URL_API + "/cart")
    .get((req: Request, res: Response) => {
      console.log("todos os produtos do carrinho");
      res.status(200).send({ "message": "sucess" });
    })
    .post(routes.cart.createCartRoute)
    .delete((req: Request, res: Response) => {
      console.log("deletei um produto do carrinho");
      res.status(200).send({ "message": "sucess" });
    });
  app.route("/" + process.env.URL_API + "/orders")
    .post((req: Request, res: Response) => {
      console.log("Fiz um pedido");
      res.status(200).send({ "message": "sucess" });
    })
    .get((req: Request, res: Response) => {
      console.log("Todos os meus pedidos");
      res.status(200).send({ "message": "sucess" });
    });

  app.listen("4000", () => {
    console.log("server running on port 4000");
  });
  app.use(routes.errorHandlerRoute);
}
