const express = require('express');
const router = express.Router();
const {orderModel} = require("../models/order");
const { paymentModel } = require('../models/payment');
const {cartModel} = require('../models/cart');

router.get("/:userid/:orderId/:paymentId/:signatureId", async function(req, res){
   let payment =  await paymentModel.findOne({orderId: req.params.orderId});
   if(!payment){
     return res.status(404).send("Payment not found");
   }

   if(payment.signatureId !== req.params.signatureId && payment.paymentId !== req.params.paymentId){
     return res.status(401).send("Invalid payment");
   }
   if(payment.status === "paid"){
     return res.status(400).send("Payment already completed");
   }
   let cart = cartModel.findOne({user : req.params.userid});
   if(!cart){
     return res.status(404).send("Cart not found");
   }
 let order =  await orderModel.create({
    orderId: req.params.orderId,
    user: req.params.userid ,
    products : cart.products,
    totalPrice: cart.totalPrice,
    currency: payment.currency,
    status: "proceesing",
    payment : payment.paymentId,
    address: payment.address,
   })

    res.render('map',{orderid : req.params.orderId})
 })
router.post("/address/:orderId", async function(req, res){
let order = await orderModel.findOne({orderId: req.params.orderId});
 if(!order){
   return res.status(404).send("Order not found");
 }
 if(!req.params.address){
    return res.status(400).send("Invalid address");
 }
 order.address = req.body.address;
 await order.save();
 res.redirect("/")
 })

 module.exports = router;