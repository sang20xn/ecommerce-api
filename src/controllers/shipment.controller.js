const prisma = require("../prisma");

// GET /api/shipments
const getShipments = async (req, res) => {
    try {
        const shipments = await prisma.shipment.findMany({
            include: {
                order: true
            }
        });

        res.json(shipments);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// GET /api/shipments/:shipid
const getShipmentById = async (req, res) => {
    try {
        const shipid = Number(req.params.shipid);

        const shipment = await prisma.shipment.findUnique({
            where: {
                shipid: shipid
            },
            include: {
                order: true
            }
        });

        if (!shipment) {
            return res.status(404).json({
                message: "Không tìm thấy shipment"
            });
        }

        res.json(shipment);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// POST /api/shipments
const createShipment = async (req, res) => {
    try {
        const {
            oid,
            status
        } = req.body;

        if (oid === undefined || !status) {
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

        const lastShipment = await prisma.shipment.findFirst({
            orderBy: {
                shipid: "desc"
            }
        });

        const newShipid = lastShipment
            ? lastShipment.shipid + 1
            : 1;

        const shipment = await prisma.shipment.create({
            data: {
                shipid: newShipid,
                oid: Number(oid),
                status: status
            }
        });

        res.status(201).json({
            message: "Tạo shipment thành công",
            shipment: shipment
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// PUT /api/shipments/:shipid
const updateShipment = async (req, res) => {
    try {
        const shipid = Number(req.params.shipid);

        const {
            status
        } = req.body;

        const existingShipment = await prisma.shipment.findUnique({
            where: {
                shipid: shipid
            }
        });

        if (!existingShipment) {
            return res.status(404).json({
                message: "Không tìm thấy shipment"
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "Vui lòng nhập status"
            });
        }

        const shipment = await prisma.shipment.update({
            where: {
                shipid: shipid
            },
            data: {
                status: status
            }
        });

        res.json({
            message: "Cập nhật shipment thành công",
            shipment: shipment
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// DELETE /api/shipments/:shipid
const deleteShipment = async (req, res) => {
    try {
        const shipid = Number(req.params.shipid);

        const existingShipment = await prisma.shipment.findUnique({
            where: {
                shipid: shipid
            }
        });

        if (!existingShipment) {
            return res.status(404).json({
                message: "Không tìm thấy shipment"
            });
        }

        await prisma.shipment.delete({
            where: {
                shipid: shipid
            }
        });

        res.json({
            message: "Xóa shipment thành công"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

module.exports = {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment
};