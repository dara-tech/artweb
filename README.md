# PreART Medical Management System

A modern web-based medical management system for HIV/AIDS treatment tracking, built with Express.js backend and React frontend, migrated from the original VB.NET application.

## 🏥 **System Overview**

The PreART system provides comprehensive management for HIV/AIDS patients across multiple health facilities, with real-time reporting and analytics capabilities.

## ✨ **Key Features**

### **Patient Management**
- **Multi-Age Group Support**: Adults, children, and infants
- **Complete Medical Records**: Comprehensive patient data management
- **Visit Tracking**: Detailed visit history and follow-up management
- **Status Monitoring**: Patient status changes and outcomes tracking

### **Reporting & Analytics**
- **Real-Time Indicators**: Live ART performance indicators
- **Site-Specific Reports**: Individual facility and aggregated reporting
- **Export Capabilities**: CSV export for external analysis
- **Performance Monitoring**: System health and query performance metrics

### **User Management**
- **Role-Based Access**: Admin, doctor, nurse, data entry, viewer roles
- **Secure Authentication**: JWT-based authentication system
- **User Administration**: Complete user management interface

### **Multi-Site Architecture**
- **Site Registry**: Central management of health facilities
- **Site-Specific Data**: Independent databases per facility
- **File Name Integration**: Unique file identifiers for data tracking
- **Scalable Design**: Support for multiple health facilities

## 🛠️ **Technology Stack**

### **Backend**
- **Node.js** with Express.js
- **MySQL** with site-specific databases
- **Sequelize** ORM for database management
- **JWT** authentication and authorization
- **Performance Monitoring** with real-time metrics

### **Frontend**
- **React 18** with Vite build system
- **Tailwind CSS** for modern styling
- **Radix UI** components for accessibility
- **React Router** for navigation
- **Custom Hooks** for state management

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd artweb
```

2. **Backend Setup**
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database credentials
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 📊 **System Architecture**

### **Database Structure**
- **Registry Database**: Central site management
- **Site Databases**: Individual facility databases (0201, 0202, 0301, etc.)
- **User Management**: Centralized user authentication
- **Performance Monitoring**: System metrics and health tracking

### **API Endpoints**

#### **Authentication**
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - User profile
- `POST /api/auth/logout` - User logout

#### **Site Management**
- `GET /api/lookups/sites-registry` - Get all sites
- `GET /api/site-operations/sites` - Site operations
- `GET /api/site-operations/sites/:code/stats` - Site statistics

#### **Reporting**
- `GET /api/indicators-optimized/all` - All indicators
- `GET /api/indicators-optimized/category/:category` - Category indicators
- `GET /api/indicators-optimized/:indicator/details` - Indicator details

## 👥 **User Roles**

- **Super Admin**: Full system access and user management
- **Admin**: Site management and reporting
- **Doctor**: Patient management and medical records
- **Nurse**: Patient care and visit management
- **Data Entry**: Patient data entry and updates
- **Viewer**: Read-only access to indicators and reports

## 🏥 **Health Facilities**

The system supports multiple health facilities with unique identifiers:
- **0201**: Maung Russey RH
- **0202**: Battambang PH
- **0301**: Kampong Cham PH
- **0306**: Chamkar Leu RH
- **1209**: Chhuk Sor
- **1801**: Preah Sihanouk PH

## 📈 **Performance Features**

- **Real-Time Data**: Live indicator updates
- **Optimized Queries**: Fast database operations
- **Caching System**: Intelligent data caching
- **Site-Specific Processing**: Parallel data processing
- **Performance Monitoring**: System health tracking

## 🔧 **Development**

### **Backend Development**
```bash
cd backend
npm run dev  # Development with auto-reload
npm test     # Run tests
```

### **Frontend Development**
```bash
cd frontend
npm run dev  # Vite development server
npm run build # Production build
```

### **Database Management**
```bash
cd backend
npm run add-file-name-field  # Add file name field
npm run test-file-name-api   # Test API endpoints
```

## 📋 **Recent Updates**

- ✅ **File Name Integration**: Added file_name field to site registry
- ✅ **Viewer Role Support**: Read-only access for viewers
- ✅ **Breadcrumb Removal**: Cleaned up navigation interface
- ✅ **Text Cleanup**: Improved user-friendly language
- ✅ **Performance Optimization**: Enhanced query performance
- ✅ **Documentation Cleanup**: Removed outdated documentation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Check the documentation in the `/docs` folder
- Review the API endpoints in the backend
- Contact the development team

---

**PreART Medical Management System** - Modernizing HIV/AIDS treatment tracking for better patient outcomes.