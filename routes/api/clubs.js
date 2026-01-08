const express = require('express');
const router = express.Router();
const Club = require('../../models/Club');

// GET /api/clubs?page=1&limit=10&search=term
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;
    const search = req.query.search ? { name: new RegExp(req.query.search, 'i') } : {};
    const clubs = await Club.find(search).skip(skip).limit(limit).lean();
    const total = await Club.countDocuments(search);
    res.json({ data: clubs, page, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// POST /api/clubs
router.post('/', async (req, res, next) => {
  try {
    const { name, category, interests, description } = req.body;
    const club = new Club({
      name,
      category,
      interests: Array.isArray(interests) ? interests : (interests ? [interests] : []),
      description
    });
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    next(err);
  }
});

module.exports = router;