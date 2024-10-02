// src/components/KanbanColumn.js
import React from 'react';
import KanbanCard from './KanbanCard';
import './KanbanColumn.css';

function KanbanColumn({ priority, tasks, priorityIcon }) {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <div className="header-left">
          <img src={priorityIcon} alt={priority} className="priority-icon" />
          <h2>{priority}</h2>
        </div>
        <div className="header-right">
          <span className="task-count">{tasks.length}</span> {/* Display task count */}
          <button className="add-task-btn">+</button> {/* "+" button */}
          <button className="menu-btn">...</button> {/* "..." button */}
        </div>
      </div>
      <div className="kanban-cards">
        {tasks.map(task => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default KanbanColumn;
