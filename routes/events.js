const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload');
const { isAuthenticated } = require('../middleware/auth');
const Event = require('../models/Event');

router.get('/', async (req, res) => {
  const events = await Event.find().populate('club');
  res.render('events/index', { events, title: 'all events' });
});

router.get('/create', isAuthenticated, eventController.getCreateEvent);
router.post('/', isAuthenticated, upload.single('poster'), eventController.createEvent);

router.get('/:id', eventController.getEvent);

router.post('/:id/rsvp', isAuthenticated, eventController.rsvpEvent);

router.get('/:id/edit', isAuthenticated, eventController.getEditEvent);
router.post('/:id/edit', isAuthenticated, upload.single('poster'), eventController.updateEvent);

router.post('/:id/delete', isAuthenticated, eventController.deleteEvent);

module.exports = router;