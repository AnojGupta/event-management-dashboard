// src/pages/AttendeeManagement.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Modal, Box, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

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

function AttendeeManagement() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [assign, setAssign] = useState({ attendeeId: '', eventId: '' });

  useEffect(() => {
    fetchAttendees();
    fetchEvents();
  }, []);

  const fetchAttendees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendees');
      setAttendees(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setForm({ name: '', email: '' }); };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssignChange = (e) => {
    setAssign({ ...assign, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/attendees', form);
      fetchAttendees();
      handleClose();
    } catch (error) {
      console.error(error);
      alert('Error adding attendee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/attendees/${id}`);
        fetchAttendees();
      } catch (error) {
        console.error(error);
        alert('Error deleting attendee');
      }
    }
  };

  const handleAssign = async () => {
    if (!assign.attendeeId || !assign.eventId) {
      alert('Please select both attendee and event');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/attendees/${assign.attendeeId}/assign/${assign.eventId}`);
      alert('Attendee assigned to event successfully');
      setAssign({ attendeeId: '', eventId: '' });
    } catch (error) {
      console.error(error);
      alert('Error assigning attendee to event');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Attendee Management</Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>Add Attendee</Button>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {attendees.map(attendee => (
          <Grid item xs={12} sm={6} md={4} key={attendee._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{attendee.name}</Typography>
                <Typography color="textSecondary">{attendee.email}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary" onClick={() => handleDelete(attendee._id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Attendee Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>Add New Attendee</Typography>
          <TextField label="Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} required />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={form.email} onChange={handleChange} required />
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</Button>
        </Box>
      </Modal>

      {/* Assign Attendee to Event */}
      <Box mt={4}>
        <Typography variant="h6">Assign Attendee to Event</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="attendee-select-label">Attendee</InputLabel>
          <Select
            labelId="attendee-select-label"
            name="attendeeId"
            value={assign.attendeeId}
            label="Attendee"
            onChange={handleAssignChange}
          >
            {attendees.map(attendee => (
              <MenuItem key={attendee._id} value={attendee._id}>{attendee.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="event-select-label">Event</InputLabel>
          <Select
            labelId="event-select-label"
            name="eventId"
            value={assign.eventId}
            label="Event"
            onChange={handleAssignChange}
          >
            {events.map(event => (
              <MenuItem key={event._id} value={event._id}>{event.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAssign}>Assign</Button>
      </Box>
    </Container>
  );
}

export default AttendeeManagement;
