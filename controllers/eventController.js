const Event = require('../models/Event');
const Club = require('../models/Club');
const path = require('path');


exports.getCreateEvent = async (req, res) => {
  try {

    const myClubs = await Club.find({ president: req.user._id });

    if (myClubs.length === 0) {
      req.flash('error', 'you need to be a Club President to create an event.');
      return res.redirect('/events');
    }

    res.render('events/create', { 
      clubs: myClubs,
      title: 'Create Event'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/events');
  }
};


exports.createEvent = async (req, res) => {
  try {
    const { title, date, location, description, clubId } = req.body;

    const eventDate = new Date(date);
    if (eventDate <= new Date()) {
      req.flash('error', 'The event date must be in the future.');
      return res.redirect('/events/create');
    }

    let posterPath = '';
    if (req.file) {
      posterPath = '/uploads/' + req.file.filename;
    } else {
        req.flash('error', 'Please upload a poster image.');
        return res.redirect('/events/create');
    }

    const newEvent = new Event({
      title,
      date: eventDate,
      location,
      description,
      posterPath, 
      club: clubId,
      attendees: []
    });

    await newEvent.save();
    req.flash('success', 'Event created successfully');
    res.redirect('/events'); 

  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating event');
    res.redirect('/events/create');
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club')
      .populate('attendees');

    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/events');
    }

    res.render('events/show', { 
      event, 
      currentUser: req.user,
      title: event.title 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/events');
  }
};

exports.getEditEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');


    if (!req.user || !event.club.president.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to edit this event.');
      return res.redirect('/events/' + event._id);
    }

    res.render('events/edit', {
      event,
      title: 'Edit Event'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/events');
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    const event = await Event.findById(req.params.id).populate('club');

    if (!event.club.president.equals(req.user._id)) {
      return res.redirect('/events');
    }

    event.title = title;
    event.date = new Date(date);
    event.location = location;
    event.description = description;

    if (req.file) {
      event.posterPath = '/uploads/' + req.file.filename;
    }

    await event.save();
    req.flash('success', 'Event updated successfully');
    res.redirect('/events/' + event._id);

  } catch (err) {
    console.error(err);
    res.redirect('back');
  }
};

exports.rsvpEvent = async (req, res) => {
  try {

    await Event.findByIdAndUpdate(req.params.id, {
      $addToSet: { attendees: req.user._id }
    });
    
    req.flash('success', 'You are now attending this event');
    res.redirect('back');
  } catch (err) {
    console.error(err);
    res.redirect('back');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');
    
    if (req.user && event.club.president.equals(req.user._id)) {
      await Event.deleteOne({ _id: req.params.id });
      req.flash('success', 'Event deleted.');
    }
    
    res.redirect('/events');
  } catch (err) {
    console.error(err);
    res.redirect('/events');
  }
};