/**
 * Seed script - creates sample users, clubs, events.
 * Usage:
 *  - locally: node seeds/seed.js
 *  - inside docker (app container): node seeds/seed.js
 *
 * Make sure MONGO_URI is set (use .env or export).
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Club = require('../models/Club');
const Event = require('../models/Event');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set. Aborting seed.');
  process.exit(1);
}

async function seed() {
  await connectDB(MONGO_URI);

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany({}), Club.deleteMany({}), Event.deleteMany({})]);

  console.log('Creating users...');
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const username = `user${i}`;
    const email = `user${i}@example.com`;
    const password = await bcrypt.hash('password123', 10);
    users.push(await User.create({ username, email, password }));
  }

  console.log('Creating clubs...');
  const sampleInterests = ['technology', 'arts', 'sports', 'science', 'music', 'literature', 'volunteering', 'gaming'];
  const clubs = [];
  for (let i = 1; i <= 10; i++) {
    const interests = [];
    for (let j = 0; j < 4; j++) {
      interests.push(sampleInterests[(i + j) % sampleInterests.length]);
    }
    const club = await Club.create({
      name: `Club ${i}`,
      category: i % 2 === 0 ? 'Academic' : 'Social',
      interests,
      description: `Description for Club ${i}`,
      president: users[i % users.length]._id,
      members: [users[i % users.length]._id]
    });
    clubs.push(club);
  }

  console.log('Creating events...');
  for (let i = 1; i <= 10; i++) {
    await Event.create({
      title: `Event ${i}`,
      date: new Date(Date.now() + i * 86400000),
      location: `Room ${100 + i}`,
      description: `Event ${i} description`,
      club: clubs[i % clubs.length]._id,
      attendees: []
    });
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});