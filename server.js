const express = require("express");
const prisma = require("./src/prisma");
const routes = require("./src/routes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware đọc JSON
app.use(express.json());

// RESTful API routes
app.use("/api", routes);

// Health check database
app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            status: "UP",
            message: "E-commerce API and database are running"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "DOWN",
            message: "Database connection failed"
        });
    }
});

// Xử lý route không tồn tại
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});