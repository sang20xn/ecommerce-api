const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const register = async (req, res) => {
    try {
        const { username, fullname, password, roleid, mid } = req.body;

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const lastUser = await prisma.user.findFirst({
            orderBy: {
                uid: "desc"
            }
        });

        const newUid = lastUser ? lastUser.uid + 1 : 1;

        const user = await prisma.user.create({
            data: {
                uid: newUid,
                username,
                fullname,
                password: hashedPassword,
                roleid: Number(roleid),
                mid: Number(mid)
            }
        });

        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                uid: user.uid,
                username: user.username,
                fullname: user.fullname,
                roleid: user.roleid,
                mid: user.mid
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập username và password"
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Username hoặc password không đúng"
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValid) {
            return res.status(401).json({
                message: "Username hoặc password không đúng"
            });
        }

        const token = jwt.sign(
            {
                uid: user.uid,
                username: user.username,
                roleid: user.roleid
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Đăng nhập thành công",
            token: token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


module.exports = {
    register,
    login
};