const express=require("express");
const { registerUser, loginUser, deleteUser, getUser, updateUser, createManyUsers } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");
const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/:username").get(getUser);
router.route("/:username").put(isAuthenticated,updateUser)
router.route("/:username").delete(deleteUser);
router.route("/createdWithArray").post(createManyUsers)


module.exports=router;