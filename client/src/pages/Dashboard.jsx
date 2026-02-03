import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data);
        } catch (error) {
            console.error("Not authorized");
        }
        };

        fetchProjects();
    }, []);

    return (
        <div>
        <h1>Dashboard</h1>

        <h2>Your Projects</h2>
        {projects.length === 0 && <p>No projects yet</p>}

        <ul>
            {projects.map((project) => (
            <li key={project._id}>{project.title}</li>
            ))}
        </ul>
        </div>
    );
};

export default Dashboard;
