const prisma = require("../prisma");

// GET /api/orders
const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        uid: true,
                        username: true,
                        fullname: true
                    }
                }
            }
        });

        res.json(orders);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// GET /api/orders/:oid
const getOrderById = async (req, res) => {
    try {
        const oid = Number(req.params.oid);

        const order = await prisma.order.findUnique({
            where: {
                oid: oid
            },
            include: {
                user: {
                    select: {
                        uid: true,
                        username: true,
                        fullname: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy order"
            });
        }

        res.json(order);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { uid } = req.body;

        if (!uid) {
            return res.status(400).json({
                message: "Vui lòng nhập uid"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                uid: Number(uid)
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy user"
            });
        }

        const lastOrder = await prisma.order.findFirst({
            orderBy: {
                oid: "desc"
            }
        });

        const newOid = lastOrder
            ? lastOrder.oid + 1
            : 1;

        const order = await prisma.order.create({
            data: {
                oid: newOid,
                uid: Number(uid),
                createat: new Date()
            }
        });

        res.status(201).json({
            message: "Tạo order thành công",
            order: order
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder
};