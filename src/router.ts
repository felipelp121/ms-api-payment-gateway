import * as routes from "./routes/mod";
import express from "express";

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
    .get(routes.cart.getCartRoute)
    .post(routes.cart.createCartRoute)
    .delete(routes.cart.deleteCartRoute);

  app.route("/" + process.env.URL_API + "/address")
    .get(routes.address.getCartRoute)
    .post(routes.address.createAddressRoute)
    .delete(routes.address.deleteCartRoute);

  app.route("/" + process.env.URL_API + "/orders")
    .post(routes.orders.orderRoute);
  // .get(routes.orders.getOrdersRoute);

  app.listen("4000", () => {
    console.log("server running on port 4000");
  });
  app.use(routes.errorHandlerRoute);
}
