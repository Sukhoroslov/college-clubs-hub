const express = require('express');
const router = express.Router();
const Event = require('../../models/Event');

// GET /api/events?page=1&limit=10
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;
    const events = await Event.find().skip(skip).limit(limit).lean();
    const total = await Event.countDocuments();
    res.json({ data: events, page, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// POST /api/events
router.post('/', async (req, res, next) => {
  try {
    const { title, date, location, description, club } = req.body;
    const ev = new Event({
      title,
      date,
      location,
      description,
      club
    });
    await ev.save();
    res.status(201).json(ev);
  } catch (err) {
    next(err);
  }
});

module.exports = router;