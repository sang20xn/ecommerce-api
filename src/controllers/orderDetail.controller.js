const prisma = require("../prisma");

// GET /api/order-details
const getOrderDetails = async (req, res) => {
    try {
        const orderDetails = await prisma.orderDetail.findMany({
            include: {
                order: true,
                product: true
            }
        });

        res.json(orderDetails);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// GET /api/order-details/:oid/:pid
const getOrderDetailById = async (req, res) => {
    try {
        const oid = Number(req.params.oid);
        const pid = Number(req.params.pid);

        const orderDetail = await prisma.orderDetail.findUnique({
            where: {
                oid_pid: {
                    oid: oid,
                    pid: pid
                }
            },
            include: {
                order: true,
                product: true
            }
        });

        if (!orderDetail) {
            return res.status(404).json({
                message: "Không tìm thấy order detail"
            });
        }

        res.json(orderDetail);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// POST /api/order-details
const createOrderDetail = async (req, res) => {
    try {
        const {
            oid,
            pid,
            qty,
            unit_price
        } = req.body;

        if (
            oid === undefined ||
            pid === undefined ||
            qty === undefined ||
            unit_price === undefined
        ) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        const order = await prisma.order.findUnique({
            where: {
                oid: Number(oid)
            }
        });

        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy order"
            });
        }

        const product = await prisma.product.findUnique({
            where: {
                pid: Number(pid)
            }
        });

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy product"
            });
        }

        const existingOrderDetail = await prisma.orderDetail.findUnique({
            where: {
                oid_pid: {
                    oid: Number(oid),
                    pid: Number(pid)
                }
            }
        });

        if (existingOrderDetail) {
            return res.status(409).json({
                message: "Order detail đã tồn tại"
            });
        }

        const orderDetail = await prisma.orderDetail.create({
            data: {
                oid: Number(oid),
                pid: Number(pid),
                qty: Number(qty),
                unit_price: Number(unit_price)
            }
        });

        res.status(201).json({
            message: "Tạo order detail thành công",
            orderDetail: orderDetail
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// PUT /api/order-details/:oid/:pid
const updateOrderDetail = async (req, res) => {
    try {
        const oid = Number(req.params.oid);
        const pid = Number(req.params.pid);

        const {
            qty,
            unit_price
        } = req.body;

        const existingOrderDetail = await prisma.orderDetail.findUnique({
            where: {
                oid_pid: {
                    oid: oid,
                    pid: pid
                }
            }
        });

        if (!existingOrderDetail) {
            return res.status(404).json({
                message: "Không tìm thấy order detail"
            });
        }

        const data = {};

        if (qty !== undefined) {
            data.qty = Number(qty);
        }

        if (unit_price !== undefined) {
            data.unit_price = Number(unit_price);
        }

        const orderDetail = await prisma.orderDetail.update({
            where: {
                oid_pid: {
                    oid: oid,
                    pid: pid
                }
            },
            data: data
        });

        res.json({
            message: "Cập nhật order detail thành công",
            orderDetail: orderDetail
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// DELETE /api/order-details/:oid/:pid
const deleteOrderDetail = async (req, res) => {
    try {
        const oid = Number(req.params.oid);
        const pid = Number(req.params.pid);

        const existingOrderDetail = await prisma.orderDetail.findUnique({
            where: {
                oid_pid: {
                    oid: oid,
                    pid: pid
                }
            }
        });

        if (!existingOrderDetail) {
            return res.status(404).json({
                message: "Không tìm thấy order detail"
            });
        }

        await prisma.orderDetail.delete({
            where: {
                oid_pid: {
                    oid: oid,
                    pid: pid
                }
            }
        });

        res.json({
            message: "Xóa order detail thành công"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
module.exports = {
    getOrderDetails,
    getOrderDetailById,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail
};