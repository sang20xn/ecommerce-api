const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, getProducts);

router.get("/:pid", authMiddleware, getProductById);

router.post("/", authMiddleware, createProduct);

router.put("/:pid", authMiddleware, updateProduct);

router.delete("/:pid", authMiddleware, deleteProduct);

module.exports = router;