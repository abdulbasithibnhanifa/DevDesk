import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

/**
 * Dashboard Component
 * Displays the list of user projects and allows creation/deletion of projects.
 */
const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --- Fetch Logic ---
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await api.get("/projects");
                setProjects(res.data);
            } catch (err) {
                setError("Failed to load projects");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // --- Event Handlers ---

    /**
     * Creates a new project and updates the list.
     */
    const createProject = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await api.post("/projects", { title });
            setProjects([...projects, res.data]);
            setTitle("");
        } catch (err) {
            setError("Failed to create project");
        }
    };

    /**
     * Deletes a project by ID.
     */
    const deleteProject = async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            setProjects(projects.filter((p) => p._id !== id));
        } catch (err) {
            setError("Failed to delete project");
        }
    };

    // Loading State
    if (loading) return <Loading message="Loading your projects..." />;

    return (
        <div className="min-vh-100">
            <Navbar />
            <div className="container pb-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">

                        <div className="mb-4">
                            <h4 className="fw-bold mb-0">Projects</h4>
                            <p className="text-muted small">Manage your ongoing work</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger py-2 shadow-sm border-0 mb-4">
                                {error}
                            </div>
                        )}

                        {/* Create Project Form */}
                        <div className="card shadow-sm border-0 p-3 mb-4">
                            <form onSubmit={createProject}>
                                <div className="d-flex gap-2">
                                    <input
                                        id="projectInput"
                                        className="form-control"
                                        placeholder="Create a new project..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <button className="btn btn-primary px-3 fw-bold">
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Project List */}
                        <div className="card shadow-sm border-0">
                            <div className="card-header border-0 py-3" style={{ backgroundColor: 'var(--card-bg)' }}>
                                <h6 className="mb-0 fw-bold">Your Projects</h6>
                            </div>

                            {/* Empty State */}
                            {projects.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted mb-0">No projects found. Create one to get started!</p>
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {projects.map((project) => (
                                        <li
                                            key={project._id}
                                            className="list-group-item list-group-item-action position-relative d-flex justify-content-between align-items-center py-4 px-4"
                                        >
                                            <Link
                                                to={`/projects/${project._id}`}
                                                className="text-decoration-none fw-bold fs-5 text-reset stretched-link"
                                            >
                                                {project.title}
                                            </Link>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    deleteProject(project._id);
                                                }}
                                                className="btn btn-outline-danger btn-sm"
                                                style={{ position: 'relative', zIndex: 2 }}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
