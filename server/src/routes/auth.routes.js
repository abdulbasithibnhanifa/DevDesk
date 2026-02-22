const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/auth.middleware");

// ======================
// REGISTER USER
// ======================
router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        //check if password is weak
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and include uppercase, lowercase, and a number",
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered.",
        });

    } catch (error) {
        next(error);
    }
});



// ======================
// LOGIN USER
// ======================
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        next(error);
    }
});

// UPDATE PROFILE
router.put("/profile", protect, async (req, res) => {
    const user = await User.findById(req.user);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;

    if (req.body.password) {
        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(
                req.body.password
            )
        ) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and include uppercase, lowercase, and a number",
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(
            req.body.password,
            salt
        );
    }

    await user.save();

    res.json({ message: "Profile updated" });
});

// DELETE ACCOUNT
router.delete("/profile", protect, async (req, res) => {
    await Task.deleteMany({ owner: req.user });
    await Project.deleteMany({ owner: req.user });
    await User.findByIdAndDelete(req.user);

    res.json({ message: "Account deleted successfully" });
});

// GET CURRENT USER
router.get("/me", protect, async (req, res) => {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

module.exports = router;
