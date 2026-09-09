# IronIQ

IronIQ is a full-stack strength-training analytics application that helps users record workouts, track strength progression, analyze training data, and receive personalized progressive-overload recommendations.

## Features

- Log exercises with sets, weight, repetitions, and RPE
- Store workout history in PostgreSQL
- View and delete previously recorded workouts
- Calculate training volume automatically
- Calculate estimated one-repetition maximum (1RM)
- Detect personal strength records by exercise
- View weekly training metrics through a dashboard
- Visualize estimated 1RM progression over time
- Receive rule-based progressive-overload recommendations
- Validate workout data on both the frontend and backend

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Recharts

### Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Psycopg

### Database

- PostgreSQL

### Testing

- pytest
- ESLint
- TypeScript/Vite production build checks

### Development

- Git
- GitHub
- Visual Studio Code

## Application Architecture

React sends HTTP requests to a FastAPI REST API. FastAPI validates incoming data with Pydantic and uses SQLAlchemy with Psycopg to persist workout data in PostgreSQL.

Workout data is processed by backend services that calculate training volume, estimated 1RM values, personal records, dashboard analytics, and progressive-overload recommendations.

## Local Development

### Backend

Create and activate a Python virtual environment, install dependencies, and start FastAPI:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

The API runs at:

```text
http://127.0.0.1:8000
```

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Install dependencies and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

### PostgreSQL

Create a local PostgreSQL database named:

```text
ironiq
```

Copy:

```text
backend/.env.example
```

to:

```text
backend/.env
```

and configure the database connection.

For example:

```text
DATABASE_URL=postgresql+psycopg://your_username@localhost:5432/ironiq
```

### Frontend Environment

Copy:

```text
frontend/.env.example
```

to:

```text
frontend/.env
```

and configure the FastAPI URL:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Testing

### Backend Tests

From the `backend` directory with the virtual environment active:

```bash
python -m pytest
```

### Frontend Linting

From the `frontend` directory:

```bash
npm run lint
```

### Frontend Production Build

```bash
npm run build
```

## Project Structure

```text
ironiq/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

## Current Status

The core full-stack MVP is functional.

Current functionality includes:

- Workout logging
- Persistent PostgreSQL storage
- Workout history
- Workout deletion
- Training-volume calculations
- Estimated 1RM calculations
- Personal-record detection
- Dashboard analytics
- Progressive-overload recommendations
- Strength-progress visualization
- Backend unit tests
- Frontend linting and production-build validation

## Planned Future Improvements

Possible future development includes:

- Individual set tracking within each workout
- User authentication and accounts
- More detailed exercise analytics
- Expanded recommendation logic
- Machine-learning performance prediction
- Automated CI testing with GitHub Actions
- Docker containerization
- Cloud deployment
