# PreART Medical Management System

A modern web-based medical management system built with Express.js backend and React frontend, migrated from the original VB.NET application.

## Features

- **Patient Management**: Complete patient records for adults, children, and infants
- **User Authentication**: Secure login system with role-based access control
- **Dashboard**: Real-time statistics and overview
- **Reports**: Comprehensive reporting and analytics
- **User Management**: Admin panel for user administration
- **Responsive Design**: Modern UI built with Material-UI

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with Sequelize ORM
- **JWT** authentication
- **bcryptjs** for password hashing
- **Express-validator** for input validation

### Frontend
- **React 18** with Vite
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** with Yup validation
- **Axios** for API calls

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd preart-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=preart
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 3. Database Setup

1. Create a MySQL database named `preart`
2. Import your existing database schema or use the provided models
3. Update the database connection settings in the `.env` file

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3001/api
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will be available at `http://localhost:3001`

### 2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Patients
- `GET /api/patients` - Get all patients (with pagination and filtering)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients/adult` - Create new adult patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient (soft delete)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Reports
- `GET /api/reports/statistics` - Get patient statistics
- `GET /api/reports/patients` - Get patient reports
- `GET /api/reports/visits` - Get visit reports
- `GET /api/reports/tests` - Get test reports

## Database Schema

The system uses the following main tables:
- `tblpatient` - Patient basic information
- `tblaimain` - Adult patient details
- `tblcimain` - Child patient details
- `tbleimain` - Infant patient details
- `tbluser` - User accounts
- `tblvisit` - Patient visits
- `tbltest` - Patient tests
- `tblstatus` - Patient status changes

## User Roles

- **Admin**: Full system access, user management
- **Doctor**: Patient management, reports
- **Nurse**: Patient management, limited reports
- **Clerk**: Basic patient operations

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
```

### Building for Production

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
```

## Migration from VB.NET

This system maintains compatibility with your existing database schema while providing:

1. **Modern Web Interface**: Responsive design that works on all devices
2. **Better Performance**: Optimized database queries and caching
3. **Enhanced Security**: JWT authentication, input validation, and security headers
4. **Scalability**: RESTful API architecture that can be extended
5. **Maintainability**: Modern codebase with proper error handling and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
