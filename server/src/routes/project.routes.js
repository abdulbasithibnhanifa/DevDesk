const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const protect = require("../middleware/auth.middleware");

// CREATE PROJECT
router.post("/", protect, async (req, res) => {
    try {
        const project = await Project.create({
        title: req.body.title,
        description: req.body.description,
        owner: req.user,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

    // GET USER PROJECTS
    router.get("/", protect, async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE PROJECT
router.put("/:id", protect, async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
});

// DELETE PROJECT
router.delete("/:id", protect, async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
