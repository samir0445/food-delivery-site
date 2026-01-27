import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const user2Route = express.Router();

user2Route.get("/current",isAuth,getCurrentUser);


export default user2Route;