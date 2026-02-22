import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

/**
 * Tasks Component
 * Manages tasks for a specific project (Create, Read, Update, Delete).
 */
const Tasks = () => {
    const { projectId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [projectName, setProjectName] = useState("");

    const [taskToDelete, setTaskToDelete] = useState(null);

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

            } catch {
                setError("Failed to load project data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);


    // --- Event Handlers ---

    /**
     * Creates a new task for the current project.
     */
    const createTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await api.post("/tasks", { title, projectId });
            setTasks([res.data, ...tasks]);
            setTitle("");
        } catch {
            setError("Failed to create task");
        }
    };

    /**
     * Updates the status of a task (todo -> in-progress -> done).
     */
    const updateStatus = async (id, status) => {
        try {
            const res = await api.put(`/tasks/${id}`, { status });
            setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
        } catch {
            setError("Failed to update task");
        }
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            // Rapid state update instead of refetching for responsiveness
            setTasks(tasks.filter(t => t._id !== taskToDelete));
            setTaskToDelete(null);
        } catch {
            setError("Failed to delete task");
            setTaskToDelete(null);
        }
    };

    // 🔹 UI STATES
    if (loading) return <Loading message="Loading tasks..." />;

    return (
        <div className="min-vh-100">
            <Navbar />
            <div className="container pb-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">

                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-bold mb-0">{projectName || "Project"}</h4>
                                <small className="text-muted">Task Management</small>
                            </div>
                            <Link to="/" className="btn btn-outline-secondary btn-sm">
                                &larr; Back
                            </Link>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="alert alert-danger py-2 shadow-sm border-0 mb-4">
                                {error}
                            </div>
                        )}

                        {/* Create Task Form */}
                        <div className="card shadow-sm border-0 p-3 mb-4">
                            <form onSubmit={createTask}>
                                <div className="d-flex gap-2">
                                    <input
                                        className="form-control"
                                        placeholder="Add a new task..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <button className="btn btn-primary px-3 fw-bold">
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Task List */}
                        <div className="card shadow-sm border-0">
                            {tasks.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted mb-0">No tasks found for this project.</p>
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {tasks.map((task) => (
                                        <li
                                            key={task._id}
                                            className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 py-3 px-4"
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div>
                                                    <span className={`fw-medium ${task.status === "done" ? "text-decoration-line-through text-muted" : ""}`}>
                                                        {task.title}
                                                    </span>
                                                    <div className="mt-1">
                                                        <span className={`badge rounded-pill ${task.status === "done" ? "bg-success" :
                                                            task.status === "in-progress" ? "bg-warning text-dark" : "bg-secondary"
                                                            }`}>
                                                            {task.status === "done" ? "Completed" :
                                                                task.status === "in-progress" ? "In Progress" : "To Do"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <div className="form-check d-flex align-items-center m-0 me-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={task.status === "done"}
                                                        onChange={() => updateStatus(task._id, task.status === "done" ? "todo" : "done")}
                                                        style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
                                                        title="Mark as Done"
                                                    />
                                                </div>
                                                {task.status !== "done" && (
                                                    <button
                                                        onClick={() => updateStatus(task._id, "in-progress")}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Mark In Progress"
                                                    >
                                                        ⏳
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => setTaskToDelete(task._id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Delete Task"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Custom Delete Confirmation Modal */}
                {taskToDelete && (
                    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header border-0">
                                    <h5 className="modal-title fw-bold text-danger">Delete Task</h5>
                                    <button type="button" className="btn-close" onClick={() => setTaskToDelete(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this task?</p>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-secondary" onClick={() => setTaskToDelete(null)}>Cancel</button>
                                    <button type="button" className="btn btn-danger fw-bold" onClick={confirmDeleteTask}>Delete Task</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default Tasks;
