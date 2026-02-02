const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const Project = require("../models/project");
const protect = require("../middleware/auth.middleware");


// CREATE TASK
router.post("/", protect, async (req, res, next) => {
    try {
        const { title, description, projectId } = req.body;

        // ensure project belongs to user
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


   // GET TASKS FOR A PROJECT (WITH PAGINATION)
router.get("/:projectId", protect, async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const tasks = await Task.find({
        project: req.params.projectId,
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



    // UPDATE TASK
    router.put("/:id", protect, async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate(
        { _id: req.params.id, owner: req.user },
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


    // DELETE TASK
    router.delete("/:id", protect, async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
        _id: req.params.id,
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
