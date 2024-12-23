// src/pages/EventManagement.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Modal, Box, TextField, Grid, Card, CardContent, CardActions } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getEvents, createEvent } from '../services/api'; // Importing the API functions

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', location: '', date: '' });

  // Fetch events on component mount
  useEffect(() => {
    getEvents()  // Using the getEvents function from api.js
      .then(response => {
        setEvents(response.data);  // Setting fetched events to state
      })
      .catch(error => {
        console.error('Error fetching events:', error);  // Handling errors
      });
  }, []);  // Empty dependency array to run once on mount

  const handleOpen = () => setOpen(true);
  const handleClose = () => { 
    setOpen(false); 
    setForm({ name: '', description: '', location: '', date: '' }); 
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Form validation before submitting
    if (!form.name || !form.location || !form.date) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await createEvent(form);  // Using createEvent function from api.js
      getEvents()  // Refresh the event list after creation
        .then(response => setEvents(response.data));
      handleClose();
    } catch (error) {
      console.error(error);
      alert('Error creating event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        getEvents()  // Refresh event list after deletion
          .then(response => setEvents(response.data));
      } catch (error) {
        console.error(error);
        alert('Error deleting event');
      }
    }
  };

  // Mapping events to FullCalendar format
  const eventsForCalendar = events.map(event => ({
    title: event.name,
    start: event.date,
    id: event._id,
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Event Management</Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>Add Event</Button>

      {/* Event List Section */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{event.name}</Typography>
                <Typography color="textSecondary">{event.description}</Typography>
                <Typography>Location: {event.location}</Typography>
                <Typography>Date: {new Date(event.date).toLocaleDateString()}</Typography>
              </CardContent>
              <CardActions>
                {/* Implement Delete functionality */}
                <Button size="small" color="secondary" onClick={() => handleDelete(event._id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Calendar View Section */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Calendar View</Typography>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={eventsForCalendar}
          eventClick={(info) => {
            // Handle event click (e.g., navigate to event details)
            console.log(info.event.id);
          }}
        />
      </Box>

      {/* Add Event Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>Add New Event</Typography>
          <TextField label="Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} required />
          <TextField label="Description" name="description" fullWidth margin="normal" value={form.description} onChange={handleChange} />
          <TextField label="Location" name="location" fullWidth margin="normal" value={form.location} onChange={handleChange} required />
          <TextField label="Date" name="date" type="date" fullWidth margin="normal" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default EventManagement;
