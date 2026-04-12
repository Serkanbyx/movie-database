# 🎬 Movie Database

A full-stack movie database application built with React and Express.js, powered by the TMDB API. Browse trending, popular, and top-rated movies & TV shows, manage your personal favorites and watchlist, and explore detailed cast & crew information.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?logo=themoviedatabase&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting a TMDB API Key](#getting-a-tmdb-api-key)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Security](#security)
- [License](#license)

---

## Features

- Browse trending, popular, and top-rated movies & TV shows
- Search movies and TV shows with debounced search
- View detailed movie/TV information (overview, rating, genres, runtime, cast)
- User authentication (register, login, JWT)
- Add/remove movies to/from Favorites list
- Add/remove movies to/from Watchlist
- User profile with stats, profile editing, and password change
- Responsive design (mobile, tablet, desktop)
- Backend proxy pattern (TMDB API key hidden from client)

---

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Frontend     | React 19, Vite, TailwindCSS v4, React Router  |
| Backend      | Node.js, Express                              |
| Database     | MongoDB, Mongoose                             |
| Auth         | JWT (jsonwebtoken, bcryptjs)                  |
| External API | TMDB (The Movie Database) API                 |
| HTTP Client  | Axios                                         |
| Security     | Helmet, CORS, HPP, express-mongo-sanitize, express-rate-limit |

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **TMDB API Key** (free) — see [below](#getting-a-tmdb-api-key)

---

## Getting a TMDB API Key

1. Go to [themoviedb.org](https://www.themoviedb.org/) and create a free account.
2. Navigate to **Settings → API**.
3. Request an API key (choose the **Developer** option).
4. Copy the **API Key (v3 auth)** value.

---

## Installation

**1. Clone the repository**

```bash
git clone <repository-url>
cd s4.9_Movie-Database
```

**2. Server setup**

```bash
cd server
npm install
```

Create a `.env` file from the example template:

```bash
cp .env.example .env
```

Fill in your values (see [Environment Variables](#environment-variables)).

**3. Client setup**

```bash
cd client
npm install
```

**4. Run development servers**

Terminal 1 — Backend:

```bash
cd server
npm run dev
```

Terminal 2 — Frontend:

```bash
cd client
npm run dev
```

The client runs at `http://localhost:5173` and the server at `http://localhost:5000`.

---

## Environment Variables

Create a `.env` file inside the `server/` directory. Reference `server/.env.example` for the template.

| Variable       | Description                              | Example                                      |
| -------------- | ---------------------------------------- | -------------------------------------------- |
| `PORT`         | Server port                              | `5000`                                       |
| `MONGODB_URI`  | MongoDB connection string                | `mongodb://localhost:27017/moviedb`           |
| `JWT_SECRET`   | Secret key for JWT signing (min 32 chars)| _your-secret-key_                            |
| `JWT_EXPIRES_IN` | JWT token expiry duration              | `30d`                                        |
| `NODE_ENV`     | Environment mode                         | `development`                                |
| `CLIENT_URL`   | Frontend URL for CORS                    | `http://localhost:5173`                       |
| `TMDB_API_KEY` | TMDB API v3 key                          | _your-tmdb-api-key_                          |
| `TMDB_BASE_URL`| TMDB API base URL                        | `https://api.themoviedb.org/3`               |

> **Warning:** Never commit your `.env` file. It is already included in `.gitignore`.

---

## API Endpoints

### Auth

| Method | Path                      | Auth | Description          |
| ------ | ------------------------- | ---- | -------------------- |
| POST   | `/api/auth/register`      | No   | Register a new user  |
| POST   | `/api/auth/login`         | No   | Login                |
| GET    | `/api/auth/me`            | Yes  | Get current user     |
| PUT    | `/api/auth/profile`       | Yes  | Update profile       |
| PUT    | `/api/auth/change-password` | Yes | Change password      |
| DELETE | `/api/auth/account`       | Yes  | Delete account       |

### Lists (Favorites & Watchlist)

| Method | Path                            | Auth | Description            |
| ------ | ------------------------------- | ---- | ---------------------- |
| GET    | `/api/list/status/:movieId`     | Yes  | Check list status      |
| GET    | `/api/list/:listType`           | Yes  | Get list items         |
| POST   | `/api/list`                     | Yes  | Add to list            |
| DELETE | `/api/list/:listType/:movieId`  | Yes  | Remove from list       |

### Movies & TV (TMDB Proxy)

| Method | Path                                    | Auth | Description           |
| ------ | --------------------------------------- | ---- | --------------------- |
| GET    | `/api/movies/trending`                  | No   | Trending movies & TV  |
| GET    | `/api/movies/search`                    | No   | Search movies & TV    |
| GET    | `/api/movies/popular`                   | No   | Popular movies        |
| GET    | `/api/movies/top-rated`                 | No   | Top rated movies      |
| GET    | `/api/movies/:mediaType/:id`            | No   | Movie/TV details      |
| GET    | `/api/movies/:mediaType/:id/credits`    | No   | Movie/TV credits      |

---

## Project Structure

```
s4.9_Movie Database/
├── client/                     # React SPA (Vite)
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── components/         # Reusable UI & layout components
│   │   ├── contexts/           # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Route-level page components
│   │   ├── services/           # API service functions
│   │   ├── utils/              # Helper utilities
│   │   ├── App.jsx             # Root component & routing
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles (Tailwind)
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express REST API
│   ├── config/                 # DB connection & env config
│   ├── controllers/            # Route handlers
│   ├── middlewares/            # Auth, error handling, rate limiting
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # Token generation, TMDB client
│   ├── validators/             # Request validation rules
│   ├── index.js                # Server entry point
│   ├── package.json
│   └── .env.example            # Environment template
│
├── README.md
└── .gitignore
```

---

## Screenshots

> _Screenshots will be added here._

---

## Security

- **JWT Authentication** — Stateless token-based auth with configurable expiry
- **Password Hashing** — bcryptjs with salt rounds
- **Helmet** — HTTP security headers
- **CORS** — Restricted to allowed client origin
- **Rate Limiting** — Prevents brute-force and abuse
- **Mongo Sanitize** — Protects against NoSQL injection
- **HPP** — HTTP parameter pollution protection
- **Input Validation** — express-validator on all user inputs
- **Backend Proxy** — TMDB API key never exposed to the client

---

## License

This project is licensed under the [MIT License](LICENSE).
