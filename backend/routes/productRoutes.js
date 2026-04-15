const express = require("express");
const {addProduct, getProducts, deleteProduct} = require("../controllers/productController");
const {auth,admin} = require("../middleware/auth");
const upload = require("../config/multer");

const router = express.Router();

router.post("/create", auth, admin, upload.single("image"), addProduct);
router.get("/", getProducts);
router.delete("/:id", auth, admin, deleteProduct);

module.exports = router;