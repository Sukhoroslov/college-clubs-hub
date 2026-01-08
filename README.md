# College Clubs Hub

Project skeleton for College Clubs Hub (Node + Express + EJS + MongoDB).

## What is included
- Basic Express app with EJS views
- Mongoose models: User, Club, Event, JoinRequest
- REST API endpoints: `/api/clubs`, `/api/events` (list + create)
- Seed script to populate sample users/clubs/events
- Dockerfile + docker-compose for Node + MongoDB
- Basic error handling and environment variable support

## Quick start (local)
1. Copy environment file:
   ```
   cp .env.example .env
   ```
   Edit `.env` and set `MONGO_URI` (e.g., `mongodb://localhost:27017/college`).

2. Install deps:
   ```
   npm ci
   ```

3. Start MongoDB (if not using docker). If you have MongoDB locally:
   ```
   mongod --dbpath /path/to/db
   ```

4. Seed the DB (optional):
   ```
   npm run seed
   ```

5. Start app:
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```
   App runs at http://localhost:3000

## Quick start (docker)
1. Build & run:
   ```
   docker-compose up --build
   ```
   This runs the app (with hot reload because compose runs `npm run dev`) and a MongoDB service.

2. To seed the DB from the host after containers are up (example):
   ```
   docker-compose exec app node seeds/seed.js
   ```

## Endpoints
- GET /api/clubs?page=1&limit=10
- POST /api/clubs
- GET /api/events?page=1&limit=10
- POST /api/events

(These are basic and will be extended with validations, file uploads, auth, etc.)

## DB design / relations (short note for demo)
- User: { username, email, passwordHash } — core account
- Club: { name, category, interests[], description, logoPath, members[], president: UserRef }
  - members: array of User references (ObjectId)
  - president: single User reference
- Event: { title, date, location, description, posterPath, attendees[], club: ClubRef }
  - attendees: array of User references
  - club: reference to the hosting club
- JoinRequest: { user: UserRef, club: ClubRef, status }
  - used for club join approvals

This design keeps documents focused and uses ObjectId references to link Users, Clubs and Events. For lists (members, attendees) arrays are stored in the parent documents; for very large membership lists we can later move to a separate Membership collection.

## Next steps (suggested)
- Add authentication (passport-local + sessions)
- Add file upload with Multer (logo/poster), file size & type checks
- Add server-side validation for create forms
- Add search / sorting / pagination improvements
- Add UI templates for club/event pages

## Notes about generated files
- Use `.env` to override `MONGO_URI` when running locally or in CI.
- docker-compose maps `MONGO_URI` to `mongodb://mongo:27017/college` between containers.
