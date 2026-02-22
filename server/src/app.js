const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const protect = require("./middleware/auth.middleware");
const app = express();
const taskRoutes = require("./routes/task.routes");
const errorHandler = require("./middleware/error.middleware");

// ✅ GLOBAL MIDDLEWARE (ALWAYS FIRST)
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5175",
        "http://localhost:4173",
        "https://dev-desk-app.vercel.app",
        process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authRoutes);

// Project routes
app.use("/api/projects", projectRoutes);

// Task routes
app.use("/api/tasks", taskRoutes);

//Error handling
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
    res.send("DevDesk API running");
});

// Protected test route
app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed protected route",
        userId: req.user,
    });
});

module.exports = app;
