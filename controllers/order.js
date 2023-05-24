import { asyncError } from '../middlewares/errorMiddleware.js';
import {Order} from '../models/Order.js';
import { instance } from '../server.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import crypto from 'crypto'; 

import { Payment } from '../models/Payment.js';

 export const createOrder = asyncError(
    async (req,res,next) =>{
   
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount
        } = req.body;
    
        const user = req.user._id;
    
        const orderOptions ={
            shippingInfo,
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount,
            user
        };
    
        await Order.create(orderOptions);
    
        res.status(201).json({
            success:true,
            message: "Order placed successfully via Cash On Delivery",
        })
    
    }
 )


 export const createOrderOnline = asyncError(
    async (req,res,next) =>{
   
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount
        } = req.body;
    
        const user = req.user._id;
    
        const orderOptions ={
            shippingInfo,
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount,
            user
        };
    
        const options ={
            amount:Number(totalAmount)*100,
            currency:"INR",
        };

        const order = await instance.orders.create(options);
    
        res.status(201).json({
            success:true,
            order,
            orderOptions
        })
    
    }
 )

export const paymentVerification = asyncError(async(req,res,next) =>{

    const {razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          orderOptions
        } = req.body;
 
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(body).digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        

        if(!isAuthentic){
            return next(new ErrorHandler("Payment verification failed",400));
        }
        else{
            const payment = await Payment.create({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
            });

           await Order.create({
                ...orderOptions,
                paidAt: new Date(Date.now()),
                paymentInfo:payment._id,
           });

           res.status(201).json({
                success:true,
                message: `Order placed successfully. Payment ID:${payment._id}`
           });

        }
});



 export const getMyOrders = asyncError(async(req,res,next) =>{
    const orders = await Order.find({
        user:req.user._id
    }).populate("user","name");

    res.status(200).json({
        success:true,
        orders,
    });

 });

 export const getOrderDetails = asyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate("user","name");

    if(!order) return next(new ErrorHandler("Invalid Order Id",404));

    res.status(200).json({
        success:true,
        order,
    })
 });

 export const getAdminOrders = asyncError(async(req,res,next) =>{
    const orders = await Order.find({}).populate("user","name");

    res.status(200).json({
        success:true,
        orders,
    });

 });

 export const processOrders = asyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id);

    if(!order) return next(new ErrorHandler("Invalid Order Id",404));

    if(order.orderStatus === "Preparing") order.orderStatus = "Shipped";
   
    else if(order.orderStatus === "Shipped"){
        order.orderStatus = "Delivered";
        order.deliveredAt = new Date(Date.now());
    }
    
    else if(order.orderStatus === "Delivered")
        return next(new ErrorHandler("Order is already delivered",400));
        
    
    await order.save();

    res.status(200).json({
        success:true,
        message:"Order status updated successfully",
    });

 });