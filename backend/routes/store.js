const express=require("express");
const { order, getOrder, deleteOrder } = require("../controllers/store");
const router=express.Router();

router.route("/order").post(order);
router.route("/order/:orderId").get(getOrder);
router.route("/order/:orderId").delete(deleteOrder);

module.exports=router;