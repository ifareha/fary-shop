const express = require('express');
const router = express.Router();
const {categoryModel} = require("../models/category");
const isAdmin = require("../middlewares/isAdmin");

router.post('/create', async (req, res) => {
    await categoryModel.create({
        name: req.body.name,
    })
    res.redirect("back");
});

module.exports = router;