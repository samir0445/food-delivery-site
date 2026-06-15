import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { acceptOrder, getCurrOrder, getDeliveryBoyAssignment, getMyOrders, getOrderById, getTodayDelivery, placeOrder, sendDeliveryOtp, updateOrderStatus, verifyDeliveryOtp } from "../controllers/order.controller.js";


const orderRoute = express.Router();

orderRoute.post("/place-order",isAuth,placeOrder)
orderRoute.get("/my-orders",isAuth,getMyOrders)
orderRoute.get("/get-assignments",isAuth,getDeliveryBoyAssignment)
orderRoute.get("/accept-order/:assingmentId",isAuth,acceptOrder)
orderRoute.get("/get-current-order",isAuth,getCurrOrder)
orderRoute.get("/get-order-by-id/:orderId",isAuth,getOrderById)
orderRoute.get("/get-today-deliveries",isAuth,getTodayDelivery)
orderRoute.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus)
orderRoute.post("/send-delivery-order",isAuth,sendDeliveryOtp)
orderRoute.post("/verify-delivery-order",isAuth,verifyDeliveryOtp)


export default orderRoute;