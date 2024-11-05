const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {adminModel} = require('../models/admin');
const {productModel} = require('../models/product');
const {categoryModel} = require('../models/category');

const {generateHash} = require('../utils/generateHash');
const {generateToken} = require('../utils/generateToken');
const validateAdmin = require('../middlewares/isAdmin');
router.get('/', function (req, res) {
    res.send("Welcome to the admin")

});
if(typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
router.post('/create', async function (req, res){
try{
 let {name,email,password,} = req.body;
 let admin = adminModel.findOne({email : email});
 if(admin){
    return res.status(400).send("admin already exists");
 }
 let hash = await generateHash(password);
 let newAdmin = await adminModel.create({
    name,
    email,
    password : hash,
 });
 await newAdmin.save();
 let token = generateToken(newAdmin);
 res.cookie("token", token);
 res.send(newAdmin);
}
catch(err){
    res.status(500).send(err.message);
}
})
}
router.get("/login",function(req,res){
    res.render("admin_login");
})

router.post("/login",async function(req,res){
    let {email,password} = req.body;
    let admin = await adminModel.findOne({email: email});
    if(!admin) return res.status(400).send("Invalid email or password");
   let valid = await bcrypt.compare(password, admin.password);
   if(!valid) return res.status(400).send("Invalid email or password");
   let token = generateToken(admin);
   res.cookie("token", token);
   res.redirect("/admin/dashboard");
});

router.get("/dashboard",validateAdmin,async function(req,res){
  let prodcount = await productModel.countDocuments();
  let categcount = await categoryModel.countDocuments();
    res.render("admin_dashboard",{prodcount,categcount});
})  
router.get("/products",validateAdmin,async function(req,res){
    let products = await productModel.find();
    try {
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
    
        const categoryProducts = {};
        result.forEach(item => {
          categoryProducts[item.category] = item.products;
        });
        res.render("admin_products",{products:categoryProducts});
      } catch (error) {
        console.error("Error fetching top-rated products by category:", error);
      }
    
})  

router.get("/logout",validateAdmin,function(req,res){
    res.cookie("token","");
    res.redirect("/admin/login");
});

module.exports = router;