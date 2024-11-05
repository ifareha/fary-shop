   require("dotenv").config();
  const express = require('express');  
  const expressSession = require('express-session');
  const app = express();
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const passport = require('passport');

  require("./config/db");
  require("./config/google_ouath_config"); 

  const indexRouter = require("./routes");
  const authRouter = require("./routes/auth");
  const adminRouter = require("./routes/admin");
  const productRouter = require("./routes/products");
  const categoryRouter = require("./routes/categories");
  const userRouter = require("./routes/user");
  const cartRouter = require("./routes/cart");
  const paymentRouter = require("./routes/payment");
  const orderRouter = require("./routes/order");

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.set('view engine', 'ejs');
 app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
 }));
app.use(cookieParser());
app.use(passport.initialize());
 app.use(passport.session());


  app.use("/",indexRouter);
 app.use("/auth",authRouter);
 app.use("/admin",adminRouter);
 app.use("/products",productRouter);
app.use("/categories",categoryRouter);
 app.use("/users",userRouter);
 app.use("/cart",cartRouter);
 app.use("/payment",paymentRouter);
 app.use("/order",orderRouter);

app.listen("8000", function(){
    console.log("Server started on port 8000");  
})