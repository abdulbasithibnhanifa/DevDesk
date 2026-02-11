const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const protect = require("../middleware/auth.middleware");
const { body, validationResult } = require("express-validator");

// CREATE PROJECT
router.post(
    "/",
    protect,
    body("title").notEmpty().withMessage("Title is required"),
    async (req, res, next) => {
        // ⛔ VALIDATION CHECK (FIRST THING)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        try {
        const project = await Project.create({
            title: req.body.title,
            description: req.body.description,
            owner: req.user,
        });

        res.status(201).json(project);
        } catch (error) {
        next(error);
        }
    }
);

// GET ALL PROJECTS FOR LOGGED-IN USER
router.get("/", protect, async (req, res, next) => {
    try {
        const projects = await Project.find({ owner: req.user });
        res.json(projects);
    } catch (error) {
        next(error);
    }
});

// GET SINGLE PROJECT
router.get("/:id", protect, async (req, res, next) => {
    try {
        const project = await Project.findOne({
        _id: req.params.id,
        owner: req.user,
        });

        if (!project) {
        return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
});


// UPDATE PROJECT
router.put("/:id", protect, async (req, res, next) => {
    try {
        const project = await Project.findOneAndUpdate(
        { _id: req.params.id, owner: req.user },
        req.body,
        { new: true }
        );

        if (!project) {
        return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
});

// DELETE PROJECT
router.delete("/:id", protect, async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
        _id: req.params.id,
        owner: req.user,
        });

        if (!project) {
        return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project deleted" });
    } catch (error) {
        next(error);
    }
});



module.exports = router;
