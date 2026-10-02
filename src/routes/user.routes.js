const express = require("express");

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getUsers);
router.get("/:uid", authMiddleware, getUserById);
router.post("/", authMiddleware, createUser);
router.put("/:uid", authMiddleware, updateUser);
router.delete("/:uid", authMiddleware, deleteUser);

module.exports = router;