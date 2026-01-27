import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

import { addItem, deleteItem, editItem, getItemByCity, getItemById } from "../controllers/item.controller.js";

const itemRoute = express.Router();

itemRoute.post("/add-item",isAuth,upload.single("image"),addItem)
itemRoute.get("/get-by-id/:itemId",isAuth,getItemById);
itemRoute.get("/remove/:itemId",isAuth,deleteItem);
itemRoute.get("/get-by-city/:city",isAuth,getItemByCity);
itemRoute.post("/edit-item/:itemId",isAuth,upload.single("image"),editItem)

export default itemRoute;