const express = require("express");
const {createCategory,getCategories} = require("../controllers/categoryController.js");
const {auth,admin} = require("../middleware/auth.js");

const router = express.Router();

router.post("/create", auth, admin, createCategory);
router.get("/get", getCategories);

module.exports = router;