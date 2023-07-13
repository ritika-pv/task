const express=require("express");
const { addPet, deletePet, getPet, findByStatus, updatePet } = require("../controllers/pet");

const router=express.Router();

router.route("").post(addPet);
router.route("/:petId").delete(deletePet);
router.route("/findByStatus").get(findByStatus);
router.route("/:petId").get(getPet);
router.route("").put(updatePet);


module.exports=router;