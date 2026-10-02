const bcrypt = require("bcryptjs");
const prisma = require("../prisma");

// GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                uid: true,
                username: true,
                fullname: true,
                roleid: true,
                mid: true
            }
        });

        res.json(users);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


// GET /api/users/:uid
const getUserById = async (req, res) => {
    try {
        const uid = Number(req.params.uid);

        const user = await prisma.user.findUnique({
            where: {
                uid: uid
            },
            select: {
                uid: true,
                username: true,
                fullname: true,
                roleid: true,
                mid: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy user"
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


// POST /api/users
const createUser = async (req, res) => {
    try {
        const {
            username,
            fullname,
            password,
            roleid,
            mid
        } = req.body;

        if (!username || !fullname || !password || !roleid || !mid) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                username: username
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username đã tồn tại"
            });
        }

        const lastUser = await prisma.user.findFirst({
            orderBy: {
                uid: "desc"
            }
        });

        const newUid = lastUser ? lastUser.uid + 1 : 1;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                uid: newUid,
                username: username,
                fullname: fullname,
                password: hashedPassword,
                roleid: Number(roleid),
                mid: Number(mid)
            },
            select: {
                uid: true,
                username: true,
                fullname: true,
                roleid: true,
                mid: true
            }
        });

        res.status(201).json({
            message: "Tạo user thành công",
            user: user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


// PUT /api/users/:uid
const updateUser = async (req, res) => {
    try {
        const uid = Number(req.params.uid);

        const {
            fullname,
            password,
            roleid,
            mid
        } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                uid: uid
            }
        });

        if (!existingUser) {
            return res.status(404).json({
                message: "Không tìm thấy user"
            });
        }

        const data = {};

        if (fullname) {
            data.fullname = fullname;
        }

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        if (roleid) {
            data.roleid = Number(roleid);
        }

        if (mid) {
            data.mid = Number(mid);
        }

        const user = await prisma.user.update({
            where: {
                uid: uid
            },
            data: data,
            select: {
                uid: true,
                username: true,
                fullname: true,
                roleid: true,
                mid: true
            }
        });

        res.json({
            message: "Cập nhật user thành công",
            user: user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


// DELETE /api/users/:uid
const deleteUser = async (req, res) => {
    try {
        const uid = Number(req.params.uid);

        const existingUser = await prisma.user.findUnique({
            where: {
                uid: uid
            }
        });

        if (!existingUser) {
            return res.status(404).json({
                message: "Không tìm thấy user"
            });
        }

        await prisma.user.delete({
            where: {
                uid: uid
            }
        });

        res.json({
            message: "Xóa user thành công"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};