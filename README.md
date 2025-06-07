# V-Assistant

A virtual assistant application with a modern frontend and robust backend.

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Redis
- Git

## Project Structure

```
V-Assistant/
├── backend/         # FastAPI backend
├── frontend/        # React frontend
└── README.md
```

## Database Setup

1. Make sure MySQL is running on your system

2. Create the database and tables using the provided SQL script:
   ```bash
   mysql -u root -p < backend/db.sql
   ```
   Note: Replace `root` with your MySQL username if different. You will be prompted for your MySQL password.

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The server will start at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Running the Complete Application

1. Start the backend server (from the backend directory):

   ```bash
   uvicorn app.main:app --reload
   ```

2. In a new terminal, start the frontend (from the frontend directory):

   ```bash
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Development

- Backend API documentation is available at `/docs` when the server is running
- The frontend uses Vite for fast development and building
- TypeScript is used for type safety in the frontend
- Material-UI is used for the component library

## Environment Variables

### Backend (.env)

```
DATABASE_URL=mysql+aiomysql://root:password@localhost:3306/ppl
REDIS_URL=redis://redis:6379/0
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
SMTP_FROM=Virtual Assistant <noreply@example.com>
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
