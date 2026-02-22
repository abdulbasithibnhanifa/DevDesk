const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/auth.middleware");

// Helper function to generate tokens and set cookies
const generateTokensAndSetCookies = async (user, res) => {
    // 1. Generate Access Token (short-lived)
    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // 15 minutes
    );

    // 2. Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, // Fallback if no specific secret
        { expiresIn: "7d" } // 7 days
    );

    // 3. Save Refresh Token to Database
    user.refreshToken = refreshToken;
    await user.save();

    // 4. Set Cookies
    const cookieOptions = {
        httpOnly: true, // Prevents XSS attacks (JS cannot read)
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Prevents CSRF attacks, needs 'none' for cross-domain Vercel->Render
    };

    res.cookie("jwt", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes in ms
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return { accessToken, refreshToken };
};


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

        // Auto-login upon registration
        await generateTokensAndSetCookies(user, res);

        res.status(201).json({
            message: "User registered and logged in successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
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

        // Generate tokens and set cookies
        await generateTokensAndSetCookies(user, res);

        res.json({
            message: "Logged in successfully",
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


// ======================
// REFRESH TOKEN
// ======================
router.post("/refresh", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        // Find the user and check if the refresh token matches the database
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate *new* access and refresh tokens (Rotation)
        await generateTokensAndSetCookies(user, res);

        res.json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
});


// ======================
// LOGOUT USER
// ======================
router.post("/logout", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            // Find user by refresh token and clear it from DB
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        };

        // Clear cookies
        res.clearCookie("jwt", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during logout" });
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

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    };

    // Clear cookies
    res.clearCookie("jwt", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

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
