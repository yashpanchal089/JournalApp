import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
    const [journals, setJournals] = useState([]);
    const [showJournals, setShowJournals] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (showJournals && journals.length === 0) {
            fetchJournals();
        }
    }, [showJournals]);

    const fetchJournals = async () => {
        try {
            const res = await API.get("/journal/me");
            setJournals(res.data);
        } catch (err) {
            console.error("Failed to fetch journals:", err?.response || err.message || err);
            // avoid uncaught exception; keep journals as empty array
        }
    };

    const handleAddJournal = () => {
        // Navigate to create page if available; fallback to console message
        try {
            navigate("/create");
        } catch (e) {
            window.location.href = "/create";
        }
    };

    const handleLogout = () => {
        try {
            // remove auth token and navigate to login
            localStorage.removeItem("token");
            localStorage.removeItem("rememberUser");
        } catch (e) {
            // ignore
        }
        navigate("/login");
    };

    const handleToggleShow = () => setShowJournals(prev => !prev);

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="page-title">My Journals</h2>
                <button className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className="action-row">
                <button className="btn-primary" onClick={handleAddJournal}>
                    Add Journal Entry
                </button>
                <button className="btn-ghost" onClick={handleToggleShow}>
                    {showJournals ? "Hide Journal Entries" : "Show Journal Entries"}
                </button>
            </div>

            {showJournals && journals.map((journal) => (
                <div key={journal.id} className="journal-card">
                    <h3>{journal.title}</h3>
                    <p>{journal.content}</p>
                    <small style={{color:'#7a6b57'}}>{journal.sentiment}</small>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
