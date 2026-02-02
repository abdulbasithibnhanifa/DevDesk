const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/task");
const Project = require("../models/project");
const protect = require("../middleware/auth.middleware");

    /* 
    CREATE TASK
    POST /api/tasks 
    */

    router.post("/", protect, async (req, res, next) => {
    try {
        const { title, description, projectId } = req.body;

        // ✅ Validate projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
        }

        // Ensure project belongs to logged-in user
        const project = await Project.findOne({
        _id: projectId,
        owner: req.user,
        });

        if (!project) {
        return res.status(404).json({ message: "Project not found" });
        }

        const task = await Task.create({
        title,
        description,
        project: projectId,
        owner: req.user,
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
    });

    /* 
    GET TASKS FOR A PROJECT (WITH PAGINATION)
    GET /api/tasks/:projectId?page=1
    */

    router.get("/:projectId", protect, async (req, res, next) => {
    const { projectId } = req.params;

    // ✅ Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
    }

    try {
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const tasks = await Task.find({
        project: projectId,
        owner: req.user,
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        next(error);
    }
    });

    /* 
    UPDATE TASK
    PUT /api/tasks/:id
    */

    router.put("/:id", protect, async (req, res, next) => {
    const { id } = req.params;

    // ✅ Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    try {
        const task = await Task.findOneAndUpdate(
        { _id: id, owner: req.user },
        req.body,
        { new: true }
        );

        if (!task) {
        return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        next(error);
    }
    });

    /*
    DELETE TASK
    DELETE /api/tasks/:id
    */

    router.delete("/:id", protect, async (req, res, next) => {
    const { id } = req.params;

    // ✅ Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    try {
        const task = await Task.findOneAndDelete({
        _id: id,
        owner: req.user,
        });

        if (!task) {
        return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
