import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { acceptOrder, getCurrOrder, getDeliveryBoyAssignment, getMyOrders, getOrderById, placeOrder, updateOrderStatus } from "../controllers/order.controller.js";


const orderRoute = express.Router();

orderRoute.post("/place-order",isAuth,placeOrder)
orderRoute.get("/my-orders",isAuth,getMyOrders)
orderRoute.get("/get-assignments",isAuth,getDeliveryBoyAssignment)
orderRoute.get("/accept-order/:assingmentId",isAuth,acceptOrder)
orderRoute.get("/get-current-order",isAuth,getCurrOrder)
orderRoute.get("/get-order-by-id/:orderId",isAuth,getOrderById)
orderRoute.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus)



export default orderRoute;