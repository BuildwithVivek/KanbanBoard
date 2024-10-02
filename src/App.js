import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import KanbanColumn from './components/KanbanColumn';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'status');
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'priority');
  const [userMap, setUserMap] = useState({}); // Map userId to userName

  const priorityMap = {
    0: 'No Priority',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Urgent',
  };

  const priorityIcons = {
    0: process.env.PUBLIC_URL + 'logo/0.svg',
    1: process.env.PUBLIC_URL + 'logo/1.svg',
    2: process.env.PUBLIC_URL + 'logo/2.svg',
    3: process.env.PUBLIC_URL + 'logo/3.svg',
    4: process.env.PUBLIC_URL + 'logo/4.svg',

    // Icons for statuses
    "Todo": process.env.PUBLIC_URL + '/logo/To-do.svg',
    "In progress": process.env.PUBLIC_URL + '/logo/in-progress.svg',
    "Backlog": process.env.PUBLIC_URL + '/logo/Backlog.svg',

    // Icons for users
    "Anoop sharma": process.env.PUBLIC_URL + '/icons/user1.svg',
    "Yogesh": process.env.PUBLIC_URL + '/icons/user2.svg',
    "Shankar Kumar": process.env.PUBLIC_URL + '/icons/user3.svg',
    "Ramesh": process.env.PUBLIC_URL + '/icons/user4.svg',
    "Suresh": process.env.PUBLIC_URL + '/icons/user5.svg',
  };

  const getPriorityLabel = (priority) => priorityMap[priority] || 'Unknown Priority';
  const getPriorityIcon = (group) => priorityIcons[group] || process.env.PUBLIC_URL + '/icons/default.svg';

  // Fetch data from API
  useEffect(() => {
    axios.get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => {
        const fetchedTasks = response.data.tickets;
        const fetchedUsers = response.data.users;

        setTasks(fetchedTasks);
        setUsers(fetchedUsers);

        // Create a user map (userId -> userName)
        const map = {};
        fetchedUsers.forEach(user => {
          map[user.id] = user.name; // Map userId to userName
        });
        setUserMap(map); // Store the mapping in state
      })
      .catch(error => console.error("Error fetching data", error));
  }, []);

  // Save groupBy and sortBy to localStorage
  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortBy', sortBy);
  }, [groupBy, sortBy]);

  // Grouping logic
  const getGroupedTasks = () => {
    let grouped = {};
    switch (groupBy) {
      case 'status':
        grouped = tasks.reduce((acc, task) => {
          (acc[task.status] = acc[task.status] || []).push(task);
          return acc;
        }, {});
        break;
      case 'user':
        grouped = tasks.reduce((acc, task) => {
          const userId = task.userId;
          const userName = userMap[userId]; // Get the user name from userMap
          (acc[userName] = acc[userName] || []).push(task);
          return acc;
        }, {});
        break;
      case 'priority':
        grouped = tasks.reduce((acc, task) => {
          const priority = task.priority;
          (acc[priority] = acc[priority] || []).push(task);
          return acc;
        }, {});
        break;
      default:
        break;
    }

    // Sorting logic
    Object.keys(grouped).forEach(group => {
      grouped[group] = grouped[group].sort((a, b) => {
        if (sortBy === 'priority') {
          return b.priority - a.priority; // Descending priority
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title); // Ascending title
        }
        return 0;
      });
    });

    return grouped;
  };

  const groupedTasks = getGroupedTasks();

  return (
    <div>
      {/* Controls */}
      <div className="controls">
        <label>Group By:</label>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>

        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {Object.keys(groupedTasks).map((group) => (
          <KanbanColumn
            key={group}
            priority={groupBy === 'priority' ? getPriorityLabel(group) : group}
            priorityIcon={getPriorityIcon(group)} // Get the corresponding icon
            tasks={groupedTasks[group]}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
