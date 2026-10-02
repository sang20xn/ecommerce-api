const prisma = require("../prisma");

// GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();

        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

// GET /api/products/:pid
const getProductById = async (req, res) => {
    try {
        const pid = Number(req.params.pid);

        const product = await prisma.product.findUnique({
            where: {
                pid: pid
            }
        });

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy product"
            });
        }

        res.json(product);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// POST /api/products
const createProduct = async (req, res) => {
    try {
        const {
            pname,
            price,
            quantity
        } = req.body;

        if (!pname || price === undefined || quantity === undefined) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        const lastProduct = await prisma.product.findFirst({
            orderBy: {
                pid: "desc"
            }
        });

        const newPid = lastProduct
            ? lastProduct.pid + 1
            : 1;

        const product = await prisma.product.create({
            data: {
                pid: newPid,
                pname: pname,
                price: Number(price),
                quantity: Number(quantity)
            }
        });

        res.status(201).json({
            message: "Tạo product thành công",
            product: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// PUT /api/products/:pid
const updateProduct = async (req, res) => {
    try {
        const pid = Number(req.params.pid);

        const {
            pname,
            price,
            quantity
        } = req.body;

        const existingProduct = await prisma.product.findUnique({
            where: {
                pid: pid
            }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Không tìm thấy product"
            });
        }

        const data = {};

        if (pname) {
            data.pname = pname;
        }

        if (price !== undefined) {
            data.price = Number(price);
        }

        if (quantity !== undefined) {
            data.quantity = Number(quantity);
        }

        const product = await prisma.product.update({
            where: {
                pid: pid
            },
            data: data
        });

        res.json({
            message: "Cập nhật product thành công",
            product: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
// DELETE /api/products/:pid
const deleteProduct = async (req, res) => {
    try {
        const pid = Number(req.params.pid);

        const existingProduct = await prisma.product.findUnique({
            where: {
                pid: pid
            }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Không tìm thấy product"
            });
        }

        await prisma.product.delete({
            where: {
                pid: pid
            }
        });

        res.json({
            message: "Xóa product thành công"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};