import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { createShop, getMyShop, getShopByCity } from "../controllers/shop.controller.js";

const shopRoute = express.Router();

shopRoute.post("/create-edit",isAuth,upload.single("image"),createShop)
shopRoute.get("/get-my",isAuth,getMyShop)
shopRoute.get("/get-shops/:city",isAuth,getShopByCity)

export default shopRoute;