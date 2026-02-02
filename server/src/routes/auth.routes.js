const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// REGISTER USER
router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
        return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const user = await User.create({
        name,
        email,
        password: hashedPassword,
        });

        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        });
    } catch (error) {
        next(error);
    }
});

const jwt = require("jsonwebtoken");

// LOGIN USER
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // check user exists
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
        }

        // create token
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


module.exports = router;

