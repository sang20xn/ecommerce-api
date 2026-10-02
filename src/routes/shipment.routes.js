const express = require("express");

const {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment
} = require("../controllers/shipment.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getShipments);

router.get("/:shipid", authMiddleware, getShipmentById);

router.post("/", authMiddleware, createShipment);

router.put("/:shipid", authMiddleware, updateShipment);

router.delete("/:shipid", authMiddleware, deleteShipment);

module.exports = router;