const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();


const protect = require("./middleware/auth.middleware");

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed protected route",
        userId: req.user,
    });
});


// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("DevDesk API running");
});

// Auth routes
app.use("/api/auth", authRoutes);

module.exports = app;
