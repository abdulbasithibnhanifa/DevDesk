require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

// 🔹 Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});