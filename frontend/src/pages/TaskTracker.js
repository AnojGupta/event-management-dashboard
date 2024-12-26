// src/pages/TaskTracker.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Select, MenuItem, FormControl, InputLabel, LinearProgress } from '@mui/material';
import axios from 'axios';
import { io } from 'socket.io-client';

function TaskTracker() {
  const [events, setEvents] = useState([]);  // To store events
  const [selectedEvent, setSelectedEvent] = useState('');  // To store the selected event ID
  const [tasks, setTasks] = useState([]);  // To store tasks

  useEffect(() => {
    // Fetch events when the component mounts
    fetchEvents();
  }, []);

  useEffect(() => {
    // Initialize Socket.IO connection for real-time updates
    const socket = io('http://localhost:5000');

    // Listen for task update events
    socket.on('taskUpdated', (updatedTask) => {
      if (updatedTask.event === selectedEvent) {
        // Update the task list if the task belongs to the selected event
        setTasks(prevTasks =>
          prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task)
        );
      }
    });

    // Cleanup the socket connection on component unmount
    return () => socket.disconnect();
  }, [selectedEvent]);  // Reinitialize the socket connection when selectedEvent changes

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);

    // Fetch tasks for the selected event
    try {
      const res = await axios.get(`http://localhost:5001/api/tasks/event/${eventId}`);
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5001/api/tasks/${taskId}/status`, { status });
      // Optimistically update the task list by changing the task status
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status } : task));
    } catch (error) {
      console.error(error);
      alert('Error updating task status');
    }
  };

  // Calculate the progress percentage based on the task status
  const calculateProgress = () => {
    if (!tasks.length) return 0;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Task Tracker</Typography>

      {/* Event Selection Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="event-select-label">Select Event</InputLabel>
        <Select
          labelId="event-select-label"
          value={selectedEvent}
          label="Select Event"
          onChange={handleEventChange}
        >
          {events.map(event => (
            <MenuItem key={event._id} value={event._id}>{event.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display tasks for selected event */}
      {selectedEvent && (
        <>
          <Typography variant="h6" gutterBottom>Tasks</Typography>
          <LinearProgress variant="determinate" value={calculateProgress()} />
          <Typography variant="body1" gutterBottom>{calculateProgress()}% Completed</Typography>

          <Grid container spacing={2}>
            {tasks.map(task => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">{task.name}</Typography>
                    <Typography>Deadline: {new Date(task.deadline).toLocaleDateString()}</Typography>
                    <Typography>Assigned To: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}</Typography>
                    <Typography>Status: {task.status}</Typography>
                  </CardContent>
                  <CardActions>
                    {/* Display button for marking task as completed only if it's pending */}
                    {task.status === 'Pending' && (
                      <Button size="small" color="primary" onClick={() => handleStatusChange(task._id, 'Completed')}>Mark as Completed</Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

export default TaskTracker;
