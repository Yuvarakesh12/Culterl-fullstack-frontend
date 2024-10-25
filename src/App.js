import React, { useState, useEffect } from 'react';
import './App.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTask = () => {
    setTitle('');
    setCompleted(false);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const addTask = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, completed: false }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      closeModal();
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${currentTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, completed }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      closeModal();
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setCompleted(task.completed);
    setIsEditing(true);
    setCurrentTaskId(task.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setCompleted(false);
    setCurrentTaskId(null);
    setIsEditing(false);
    setError('');
  };

  return (
    <div>
      <h1>To-Do List</h1>
      {error && <div className="error">{error}</div>}
      <div className="addbutton">
        <button onClick={handleAddTask}>
          <FaPlus /> Add Task
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Title</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.completed ? 'Yes' : 'No'}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(task)}>
                  <FaEdit /> Edit
                </button>
                <button className="delete" onClick={() => deleteTask(task.id)}>
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>{isEditing ? 'Edit Task' : 'Add Task'}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>
      <button onClick={isEditing ? updateTask : addTask}>
        {isEditing ? <FaSave /> : <FaPlus />}
        {isEditing ? ' Update Task' : ' Add Task'}
      </button>
      <button className="cancel-button" onClick={closeModal}>
        <FaTimes /> Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default App;
