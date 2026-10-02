const express = require("express");

const {
    getOrderDetails,
    getOrderDetailById,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail
} = require("../controllers/orderDetail.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getOrderDetails);

router.get("/:oid/:pid", authMiddleware, getOrderDetailById);

router.post("/", authMiddleware, createOrderDetail);

router.put("/:oid/:pid", authMiddleware, updateOrderDetail);

router.delete("/:oid/:pid", authMiddleware, deleteOrderDetail);
module.exports = router;