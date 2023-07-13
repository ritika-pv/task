const express=require("express");
const { order } = require("../controllers/store");
const router=express.Router();

router.route("/order").post(order);

module.exports=router;