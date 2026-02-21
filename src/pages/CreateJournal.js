import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateJournal() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const createJournal = async () => {
        // Prevent saving completely empty (null) entries
        const titleTrim = (title || "").trim();
        const contentTrim = (content || "").trim();
        if (!titleTrim && !contentTrim) {
            alert("Please enter a title or content before saving.");
            return;
        }

        const endpoints = ["/journal/me", "/journal", "/journals"];
        const errors = [];
        for (const ep of endpoints) {
            try {
                await API.post(ep, { title, content });
                navigate("/dashboard");
                return;
            } catch (err) {
                console.warn(`POST ${ep} failed:`, err?.response || err.message || err);
                errors.push({ endpoint: ep, error: err?.response || err.message || err });
            }
        }
        console.error("All journal create endpoints failed:", errors);
        alert("Failed to save journal. Check console for endpoint errors (404/401/CORS).");
    };

    return (
        <div className="container">
            <h2>Create Journal</h2>

            <div className="create-journal">
                <div className="form-field">
                    <input
                        className="journal-input"
                        value={title}
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <textarea
                        className="journal-textarea"
                        value={content}
                        placeholder="Content"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="form-actions">
                    <button
                        onClick={createJournal}
                        disabled={!(title && title.trim()) && !(content && content.trim())}
                        className="btn-primary"
                        style={{opacity: (!(title && title.trim()) && !(content && content.trim())) ? 0.65 : 1, minWidth:140}}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateJournal;
