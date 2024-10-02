import React from 'react';
import './KanbanCard.css'; // Make sure to define appropriate styles in this CSS file.

export default function KanbanCard({ task }) {
    // Function to get logo based on status
    const getStatusLogo = (status) => {
        switch (status) {
            case 'Todo':
                return process.env.PUBLIC_URL + '/logo/To-do.svg'; // replace with actual image paths
            case 'In progress':
                return process.env.PUBLIC_URL + '/logo/in-progress.svg';
            case 'Backlog':
                return process.env.PUBLIC_URL + '/logo/Backlog.svg';
            default:
                return process.env.PUBLIC_URL + '/logo/To-do.svg';
        }
    };

    return (
        <div className="kanban-card">
            <div className="kanban-card-header">
                <span className="task-id">{task.id}</span> {/* Task ID */}
                <img
                    src={getStatusLogo(task.status)} // Show image based on status
                    alt={task.status}
                    className="status-logo"
                />
            </div>
            <h3 className="task-title">{task.title}</h3> {/* Task title */}
            <div className="kanban-card-footer">
                <span className={`priority-icon ${task.priority}`}>
                    {task.priority === 'high' ? '!' : ''}
                </span> {/* Priority icon */}
                <span className="task-tag">{task.tag}</span> {/* Task tag */}
            </div>
        </div>
    );
}
