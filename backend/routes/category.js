const express=require("express");
const { addCategory } = require("../controllers/category");

const router=express.Router();

router.route("/addCategory").post(addCategory);



module.exports=router;