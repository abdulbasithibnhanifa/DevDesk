import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const Tasks = () => {
    const { projectId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [projectName, setProjectName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
            setLoading(true);

            // Fetch project details
            const projectRes = await api.get(`/projects/${projectId}`);
            setProjectName(projectRes.data.title);

            // Fetch tasks
            const taskRes = await api.get(`/tasks/${projectId}`);
            setTasks(taskRes.data);

            } catch (err) {
            setError("Failed to load project data");
            } finally {
            setLoading(false);
            }
        };
        fetchData();
}, [projectId]);


    const createTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
        const res = await api.post("/tasks", { title, projectId });
        setTasks([res.data, ...tasks]);
        setTitle("");
        } catch (err) {
        setError("Failed to create task");
        }
    };

    const updateStatus = async (id, status) => {
        try {
        const res = await api.put(`/tasks/${id}`, { status });
        setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
        } catch (err) {
        setError("Failed to update task");
        }
    };

    const deleteTask = async (id) => {
        try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter((t) => t._id !== id));
        } catch (err) {
        setError("Failed to delete task");
        }
    };

    // 🔹 UI STATES
    if (loading) return <p>Loading tasks...</p>;

    return (
            <div className="bg-light min-vh-100 py-5">
                <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

                    <div className="card shadow border-0 p-4">

                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-0">{projectName || "Project"}</h5>
                                <small className="text-muted">Task Manager</small>
                            </div>
                                <Link
                                    to="/"
                                    className="btn btn-sm btn-outline-secondary"
                                >
                                    Back
                                </Link>
                        </div>

                        {/* Error */}
                        {error && (
                        <div className="alert alert-danger py-2">
                            {error}
                        </div>
                        )}

                        {/* Create Task */}
                        <form onSubmit={createTask} className="mb-4">
                        <div className="input-group">
                            <input
                            className="form-control"
                            placeholder="New task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            />
                            <button className="btn btn-primary">
                            Add
                            </button>
                        </div>
                        </form>

                        {/* Empty State */}
                        {tasks.length === 0 && (
                        <p className="text-muted small">
                            No tasks yet
                        </p>
                        )}

                        {/* Task List */}
                        <ul className="list-group">
                        {tasks.map((task) => (
                            <li
                            key={task._id}
                            className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
                            >
                            {/* Task Title + Status */}
                            <div>
                                <div className="fw-medium">
                                {task.title}
                                </div>

                                <span
                                className={`badge ${
                                    task.status === "done"
                                    ? "bg-success"
                                    : task.status === "in-progress"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                                }`}
                                >
                                {task.status}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="d-flex flex-wrap gap-2">
                                <button
                                onClick={() =>
                                    updateStatus(task._id, "todo")
                                }
                                className="btn btn-sm btn-outline-secondary"
                                >
                                Todo
                                </button>

                                <button
                                onClick={() =>
                                    updateStatus(task._id, "in-progress")
                                }
                                className="btn btn-sm btn-outline-warning"
                                >
                                In Progress
                                </button>

                                <button
                                onClick={() =>
                                    updateStatus(task._id, "done")
                                }
                                className="btn btn-sm btn-outline-success"
                                >
                                Done
                                </button>

                                <button
                                onClick={() => deleteTask(task._id)}
                                className="btn btn-sm btn-outline-danger"
                                >
                                Delete
                                </button>
                            </div>
                            </li>
                        ))}
                        </ul>

                    </div>

                    </div>
                </div>
                </div>
            </div>
);

};

export default Tasks;
