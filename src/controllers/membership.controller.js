const prisma = require("../prisma");

// GET /api/memberships
const getMemberships = async (req, res) => {
    try {
        const memberships = await prisma.memberShip.findMany();

        res.json(memberships);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


// GET /api/memberships/:mid
const getMembershipById = async (req, res) => {
    try {
        const mid = Number(req.params.mid);

        const membership = await prisma.memberShip.findUnique({
            where: {
                mid: mid
            }
        });

        if (!membership) {
            return res.status(404).json({
                message: "Không tìm thấy membership"
            });
        }

        res.json(membership);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


// POST /api/memberships
const createMembership = async (req, res) => {
    try {
        const { mname, score } = req.body;

        if (!mname || score === undefined) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        const lastMembership = await prisma.memberShip.findFirst({
            orderBy: {
                mid: "desc"
            }
        });

        const newMid = lastMembership
            ? lastMembership.mid + 1
            : 1;

        const membership = await prisma.memberShip.create({
            data: {
                mid: newMid,
                mname: mname,
                score: Number(score)
            }
        });

        res.status(201).json({
            message: "Tạo membership thành công",
            membership: membership
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


// PUT /api/memberships/:mid
const updateMembership = async (req, res) => {
    try {
        const mid = Number(req.params.mid);
        const { mname, score } = req.body;

        const existingMembership = await prisma.memberShip.findUnique({
            where: {
                mid: mid
            }
        });

        if (!existingMembership) {
            return res.status(404).json({
                message: "Không tìm thấy membership"
            });
        }

        const data = {};

        if (mname) {
            data.mname = mname;
        }

        if (score !== undefined) {
            data.score = Number(score);
        }

        const membership = await prisma.memberShip.update({
            where: {
                mid: mid
            },
            data: data
        });

        res.json({
            message: "Cập nhật membership thành công",
            membership: membership
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


// DELETE /api/memberships/:mid
const deleteMembership = async (req, res) => {
    try {
        const mid = Number(req.params.mid);

        const existingMembership = await prisma.memberShip.findUnique({
            where: {
                mid: mid
            }
        });

        if (!existingMembership) {
            return res.status(404).json({
                message: "Không tìm thấy membership"
            });
        }

        await prisma.memberShip.delete({
            where: {
                mid: mid
            }
        });

        res.json({
            message: "Xóa membership thành công"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};


module.exports = {
    getMemberships,
    getMembershipById,
    createMembership,
    updateMembership,
    deleteMembership
};