const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const membershipRoutes = require("./membership.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const orderDetailRoutes = require("./orderDetail.routes");
const shipmentRoutes = require("./shipment.routes");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "E-commerce API is running",
        version: "1.0.0"
    });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/memberships", membershipRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/order-details", orderDetailRoutes);
router.use("/shipments", shipmentRoutes);
module.exports = router;