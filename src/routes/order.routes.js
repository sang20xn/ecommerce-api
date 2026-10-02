const express = require("express");

const {
    getOrders,
    getOrderById,
    createOrder
} = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, getOrders);

router.get("/:oid", authMiddleware, getOrderById);

router.post("/", authMiddleware, createOrder);

module.exports = router;