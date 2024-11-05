const express = require('express');
const router = express.Router();
const {productModel,validateProduct} = require("../models/product");
const {categoryModel,validateCategory} = require("../models/category");
const {cartModel} = require("../models/cart");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../config/multer_config");
const isLoggedIn = require('../middlewares/isLoggedIn');


router.get('/',isLoggedIn, async (req, res) => {
  try {
    let somethingInCart = false;
    let cartCount = 0;
    const result = await productModel.aggregate([   
      { 
        $group: { 
          _id: "$category",
          products: { $push: "$$ROOT" } 
        }
      },

      { 
        $project: {
          category: "$_id",
          products: { $slice: ["$products", 10] },
          _id: 0
        }
      }
    ]);
    let cart = await cartModel.findOne({user : req.session.passport.user});
  if(cart && cart.products.length > 0){
    cartCount = cart.products.length + 1;
    somethingInCart = true;
  }

     let rnproducts = await  productModel.aggregate([{$sample : {size : 6}}])
    const categoryProducts = {};
    result.forEach(item => {
      categoryProducts[item.category] = item.products;
    });

    res.render('index',{products:categoryProducts, rnproducts:rnproducts,somethingInCart,cartCount});
  } catch (error) {
    console.error("Error fetching top-rated products by category:", error);
  }
   
});

router.post("/",upload.single("image"), async (req, res) => {
  let {name, price, category, stock, description, image} = req.body;
  try{
    let {error} = validateProduct({name, price, category, stock, description, image});
    if(error) return res.status(400).send(error.details[0].message);

    let isCategory = await categoryModel.findOne({name : category });
    if(!isCategory){
       await categoryModel.create({name : category});
    }

    let product = await productModel.create(
      {
        name, 
       price,
       category,
       stock,
       description,
       image : req.file.buffer
      }
    );
    await product.save();
     res.redirect("/admin/products")
}
catch(err){
    res.status(500).send(err.message);
}
})

router.get("/delete/:id",isAdmin,async function(req, res) {
  let prod = await productModel.findOneAndDelete({_id : req.params.id});
   res.redirect("/admin/products")
})
router.post("/delete/",isAdmin,async function(req, res) {
  let prod = await productModel.findOneAndDelete({_id : req.body.product_id});
   res.redirect("/admin/products")
})
module.exports = router;