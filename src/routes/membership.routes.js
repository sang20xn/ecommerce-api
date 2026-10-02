const express = require("express");

const {
    getMemberships,
    getMembershipById,
    createMembership,
    updateMembership,
    deleteMembership
} = require("../controllers/membership.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getMemberships);

router.get("/:mid", authMiddleware, getMembershipById);

router.post("/", authMiddleware, createMembership);

router.put("/:mid", authMiddleware, updateMembership);

router.delete("/:mid", authMiddleware, deleteMembership);

module.exports = router;