import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // 🔹 Fetch Projects
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

    // 🔹 Create Project
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

    // 🔹 Logout
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // 🔹 Loading state
    if (loading) return <p>Loading projects...</p>;

    const deleteProject = async (id) => {
    try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
        setError("Failed to delete project");
    }
};

    return (
            <div className="bg-light min-vh-100 py-5">
                <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

                    <div className="card shadow border-0 p-4">

                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="fw-bold mb-0">DevDesk</h5>
                            <small className="text-muted">Project Manager</small>
                        </div>

                        <div className="d-flex gap-2">
                            <Link to="/profile" className="btn btn-sm btn-outline-secondary">
                            Profile
                            </Link>

                            <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleLogout}
                            >
                            Logout
                            </button>
                        </div>
                        </div>

                        {/* Error */}
                        {error && (
                        <div className="alert alert-danger py-2">
                            {error}
                        </div>
                        )}

                        {/* Create Project */}
                        <form onSubmit={createProject} className="mb-4">
                        <div className="input-group">
                            <input
                            className="form-control"
                            placeholder="New project title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            />
                            <button className="btn btn-primary">
                            Add
                            </button>
                        </div>
                        </form>

                        {/* Project List Title */}
                        <h6 className="text-uppercase text-muted small mb-3">
                        Your Projects
                        </h6>

                        {/* Empty State */}
                        {projects.length === 0 && (
                        <p className="text-muted small">
                            No projects yet
                        </p>
                        )}

                        {/* Project List */}
                        <ul className="list-group">
                        {projects.map((project) => (
                            <li
                            key={project._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                            >
                            <Link
                                to={`/projects/${project._id}`}
                                className="text-decoration-none fw-medium"
                            >
                                {project.title}
                            </Link>

                            <button
                                onClick={() => deleteProject(project._id)}
                                className="btn btn-sm btn-outline-danger"
                            >
                                Delete
                            </button>
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

export default Dashboard;
