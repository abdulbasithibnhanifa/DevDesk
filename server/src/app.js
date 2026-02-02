const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const protect = require("./middleware/auth.middleware");

const app = express();

// ✅ GLOBAL MIDDLEWARE (ALWAYS FIRST)
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("DevDesk API running");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Project routes
app.use("/api/projects", projectRoutes);

// Protected test route
app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed protected route",
        userId: req.user,
    });
});

module.exports = app;
