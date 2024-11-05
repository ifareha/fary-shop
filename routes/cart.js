const express = require('express');
const router = express.Router();
const {cartModel,validateCart} = require('../models/cart');
const {productModel} = require('../models/product');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/',isLoggedIn,async function(req, res) {
 try{
    let cart = await cartModel.findOne({user : req.session.passport.user}).populate("products");
    let cartDataStructure = {};
    cart.products.forEach((product) =>{
        let key = product._id.toString();
        if(cartDataStructure[key]){
            cartDataStructure[key].quantity++;
        }
        else{
            cartDataStructure[key] = {
                ...product._doc,
                quantity : 1
            }
        }
    })
    let finalArray = Object.values(cartDataStructure);
    res.render("cart",{cart: finalArray, finalprice : cart.totalPrice,userid :req.session.passport.user});
 }
 catch(err){
    console.error(err);
    res.send(err.message);
 }

});
router.get("/add/:id",isLoggedIn,async function(req, res) {
try{
 let cart = await cartModel.findOne({user : req.session.passport.user});
 let product = await productModel.findOne({_id : req.params.id});
 if(!cart){
    cart = await cartModel.create({
    user : req.session.passport.user,
    products : [req.params.id],
    totalPrice : Number(product.price)
});
await cart.save();
res.redirect("back")
}
else{
  cart.products.push(req.params.id);
  cart.totalPrice += Number(product.price);
  await cart.save();
res.redirect("back")
}

}
catch(err){
    res.send(err.message);
}
})
router.get("/remove/:id",isLoggedIn,async function(req,res){
    try{
   let cart = await cartModel.findOne({user : req.session.passport.user});
   let product = await productModel.findOne({_id : req.params.id})
   if(!cart) return res.send("something went wrong");
   let index = cart.products.indexOf(req.params.id);
   if(index !== -1){
    cart.products.splice(index, 1);
    cart.totalPrice -= Number(product.price);
    await cart.save();
    res.redirect("/cart")
   }
   else{
    res.send("Product not found in cart");
   }
    }
    catch(err){
        res.send(err.message);
    }

})
module.exports = router;