import dotenv from "dotenv";
require("express-async-errors"); //try to change to import instead require
import { router } from "./router";
dotenv.config();

router();
