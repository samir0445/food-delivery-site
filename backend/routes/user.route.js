import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser, updateUserLocation } from "../controllers/user.controller.js";

const user2Route = express.Router();

user2Route.get("/current",isAuth,getCurrentUser);
user2Route.post("/update-location",isAuth,updateUserLocation);


export default user2Route;