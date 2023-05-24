import express from "express";
import { createOrder, createOrderOnline, getAdminOrders, getMyOrders, getOrderDetails, paymentVerification, processOrders } from "../controllers/order.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.post("/createorder", isAuthenticated, createOrder);

router.post("/createorderonline" , isAuthenticated ,createOrderOnline);

router.post("/paymentverification" , isAuthenticated ,paymentVerification);

router.get("/myorders", isAuthenticated, getMyOrders);

router.get("/order/:id", isAuthenticated, getOrderDetails);

//Add admin middlewares
router.get("/admin/orders", isAuthenticated, authorizeAdmin, getAdminOrders);
router.get("/admin/order/:id", isAuthenticated, authorizeAdmin, processOrders);


export default router;
