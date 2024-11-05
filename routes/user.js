const express = require('express');
const router = express.Router();
const {userModel , validateUser} = require('../models/user');

router.get('/login', (req, res) => {
    res.render('user_login');
});

router.get('/profile', (req, res) => {
    res.send("Welcome to the public profile")
});

router.get('/logout', (req, res,next) => {
    req.logout(function(err) {
        if(err) return next(err);
        req.session.destroy(function(err) {
            if(err) return next(err);
            res.clearCookie("connect.sid");
            res.redirect('/users/login');
        });
    });
});
module.exports = router;