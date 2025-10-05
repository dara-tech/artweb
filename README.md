# 🏥 ART Medical Management System
## Complete User & Developer Documentation

---

## 📋 **Table of Contents**

1. [System Overview](#system-overview)
2. [Key Features](#key-features)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Getting Started](#getting-started)
5. [User Interface Guide](#user-interface-guide)
6. [API Documentation](#api-documentation)
7. [Database Structure](#database-structure)
8. [Development Guide](#development-guide)
9. [Troubleshooting](#troubleshooting)
10. [Support & Maintenance](#support--maintenance)

---

## 🏥 **System Overview**

The ART Medical Management System is a comprehensive web-based platform for managing HIV/AIDS treatment across multiple health facilities. It provides real-time reporting, patient management, and analytics capabilities for healthcare professionals.

### **Architecture**
- **Frontend**: React 18 with Vite, Tailwind CSS, Radix UI
- **Backend**: Node.js with Express.js, MySQL, Sequelize ORM
- **Authentication**: JWT-based with role-based access control
- **Database**: Multi-site architecture with individual databases per facility (art_ prefix)
- **Migration**: Successfully migrated from preart_ to art_ naming convention

### **Health Facilities Supported**
- **0201**: Maung Russey RH (art_0201)
- **0202**: Battambang PH (art_0202)
- **0301**: Kampong Cham PH (art_0301)
- **0306**: Chamkar Leu RH (art_0306)
- **1209**: Chhuk Sor (art_1209)
- **1801**: Preah Sihanouk PH (art_1801)
- **2101**: Takeo PH (art_2101)
- **2104**: Preykbas (art_2104)

### **🔄 Database Migration Status**
✅ **Migration Completed Successfully** (January 2025)
- **From**: `preart_` naming convention
- **To**: `art_` naming convention
- **Databases Migrated**: 7 databases
- **Data Integrity**: 100% preserved
- **Migration Tools**: Available in `backend/scripts/`

---

## ✨ **Key Features**

### **👥 Patient Management**
- **Multi-Age Group Support**: Adults, children, and infants
- **Complete Medical Records**: Comprehensive patient data management
- **Visit Tracking**: Detailed visit history and follow-up management
- **Status Monitoring**: Patient status changes and outcomes tracking
- **Search & Filter**: Advanced patient search and filtering capabilities

### **📊 Reporting & Analytics**
- **Real-Time Indicators**: Live ART performance indicators
- **Site-Specific Reports**: Individual facility and aggregated reporting
- **Export Capabilities**: CSV export for external analysis
- **Performance Monitoring**: System health and query performance metrics
- **Executive Summary**: Key performance indicators at a glance

### **🔐 User Management**
- **Role-Based Access**: 7 different user roles with specific permissions
- **Secure Authentication**: JWT-based authentication system
- **User Administration**: Complete user management interface
- **Site Assignment**: Users can be assigned to specific health facilities

### **🏢 Multi-Site Architecture**
- **Site Registry**: Central management of health facilities
- **Site-Specific Data**: Independent databases per facility
- **File Name Integration**: Unique file identifiers for data tracking
- **Scalable Design**: Support for unlimited health facilities

### **📁 Data Import/Export**
- **SQL File Import**: Upload SQL files to create new sites and databases
- **Automatic Site Detection**: Extract site information from `tblsitename` tables
- **Data Validation**: Comprehensive validation before import
- **Progress Tracking**: Real-time import progress monitoring

---

## 👥 **User Roles & Permissions**

### **🔑 Super Administrator**
- **Full System Access**: Complete control over all features
- **User Management**: Create, edit, delete users and roles
- **Site Management**: Manage all health facilities
- **Data Import**: Import SQL files and create new sites
- **System Administration**: Access to all administrative functions

### **👨‍💼 Administrator**
- **Site Management**: Manage assigned health facilities
- **User Management**: Create and manage users for assigned sites
- **Patient Management**: Full patient data access
- **Reporting**: Access to all reports and analytics
- **Data Entry**: Complete data entry capabilities

### **👨‍⚕️ Doctor**
- **Patient Care**: Full patient management and medical records
- **Medical Data**: Enter and update medical information
- **Reports**: Access to medical reports and analytics
- **Data Entry**: Medical data entry and updates

### **👩‍⚕️ Nurse**
- **Patient Care**: Basic patient management
- **Data Entry**: Basic data entry capabilities
- **Reports**: Access to basic reports

### **📝 Data Entry**
- **Data Entry Only**: Limited to data entry functions
- **No Medical Decisions**: Cannot make medical decisions
- **Basic Reports**: Access to basic reporting

### **👁️ Viewer**
- **Read-Only Access**: View reports and data only
- **No Data Entry**: Cannot modify any data
- **Indicators Only**: Access to indicators and reports

### **🏢 Site Manager**
- **Site Operations**: Manage specific site operations
- **Data Entry**: Site-specific data entry
- **Reports**: Site-specific reporting

---

## 🚀 **Getting Started**

### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Valid user account provided by administrator

### **Login Process**
1. Navigate to the application URL
2. Enter your username and password
3. Click "Login" to access the system
4. You'll be redirected to your role-appropriate dashboard

### **First Time Setup**
1. **Change Password**: Update your default password
2. **Profile Setup**: Complete your user profile
3. **Site Assignment**: Ensure you're assigned to the correct health facilities
4. **Training**: Review the user interface guide below

---

## 🖥️ **User Interface Guide**

### **Main Navigation**

#### **Dashboard** (Admin/Super Admin only)
- **Patient Statistics**: Total adults, children, and infants
- **Quick Actions**: Direct links to create new patients
- **System Information**: Current system status

#### **Patient Management** (Admin/Super Admin only)
- **Patient List**: View and search all patients
- **New Patient Forms**:
  - Adult Patient Form
  - Child Patient Form  
  - Infant Patient Form
- **Patient Search**: Advanced search and filtering
- **Patient Details**: Complete patient information

#### **Visit Management** (Admin/Super Admin only)
- **Visit Lists**: View visits by patient type
- **New Visit Forms**:
  - Adult Visit Form
  - Child Visit Form
  - Infant Visit Form
- **Visit History**: Complete visit tracking

#### **Indicators & Reports** (All Users)
- **Main Indicators**: Real-time ART performance indicators
- **Site Selection**: Choose specific health facilities
- **Date Range**: Select reporting periods
- **Export Options**: Download reports in CSV format
- **Executive Summary**: Key performance metrics

#### **Data Management** (Admin/Super Admin only)
- **Data Import/Export**: Manage data transfers
- **Site Management**: Configure health facilities
- **System Settings**: Application configuration

#### **User Management** (Admin/Super Admin only)
- **User List**: View all system users
- **Role Management**: Assign and modify user roles
- **User Creation**: Add new users to the system
- **Permission Management**: Configure user access levels

#### **Import Data** (Admin/Super Admin only)
- **SQL File Upload**: Upload SQL files to create new sites
- **Site Creation**: Create new health facilities
- **Data Validation**: Validate imported data
- **Progress Tracking**: Monitor import progress

### **Key Interface Elements**

#### **Site Filter**
- Located in the top navigation
- Select specific health facilities
- "All Sites" option for aggregated data
- Real-time filtering of all data

#### **Search & Filter**
- Advanced search capabilities
- Multiple filter options
- Real-time results
- Save filter preferences

#### **Status Indicators**
- **Active**: Green - Patient is active
- **Inactive**: Gray - Patient is inactive
- **Transferred**: Orange - Patient transferred out
- **Lost**: Red - Patient lost to follow-up
- **Dead**: Dark Gray - Patient deceased

#### **Data Tables**
- Sortable columns
- Pagination controls
- Export options
- Responsive design

---

## 🔌 **API Documentation**

### **Authentication Endpoints**

#### **POST /api/auth/login**
Login to the system
```json
{
  "username": "string",
  "password": "string"
}
```

#### **GET /api/auth/profile**
Get current user profile
```json
{
  "id": "number",
  "username": "string",
  "fullName": "string",
  "role": "string",
  "assignedSites": "array"
}
```

#### **POST /api/auth/logout**
Logout from the system

### **Site Management Endpoints**

#### **GET /api/site-operations/sites**
Get all available sites
```json
{
  "success": true,
  "sites": [
    {
      "code": "0201",
      "name": "Maung Russey RH",
      "province": "Battambang",
      "database_name": "preart_0201",
      "status": 1
    }
  ]
}
```

#### **GET /api/site-operations/sites/:code/stats**
Get site statistics
```json
{
  "success": true,
  "stats": {
    "totalPatients": 150,
    "activePatients": 120,
    "newThisMonth": 5
  }
}
```

### **Indicators Endpoints**

#### **GET /api/indicators-optimized/all**
Get all indicators for selected site and date range
```json
{
  "success": true,
  "indicators": [
    {
      "id": "01_active_art_previous",
      "name": "Active ART Previous Period",
      "value": 150,
      "category": "enrollment"
    }
  ]
}
```

#### **GET /api/indicators-optimized/category/:category**
Get indicators by category
- Categories: `enrollment`, `retention`, `treatment`, `outcomes`

#### **GET /api/indicators-optimized/:indicator/details**
Get detailed breakdown of specific indicator

### **Patient Management Endpoints**

#### **GET /api/patients/adult**
Get adult patients
```json
{
  "success": true,
  "patients": [
    {
      "clinicId": "0201-001",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1980-01-01",
      "sex": "M"
    }
  ],
  "total": 50
}
```

#### **POST /api/patients/adult**
Create new adult patient

#### **PUT /api/patients/adult/:id**
Update adult patient

#### **DELETE /api/patients/adult/:id**
Delete adult patient

### **Import Data Endpoints**

#### **POST /api/import/sql**
Import SQL file and create new site
```json
{
  "createNewDatabase": "true",
  "siteCode": "0205",
  "siteName": "New Health Center",
  "province": "Phnom Penh",
  "district": "Chamkar Mon",
  "fileName": "site_data_2024.sql"
}
```

---

## 🗄️ **Database Structure**

### **Registry Database (art_sites_registry)**
Central database for system management
**Status**: ✅ Active and migrated from preart_sites_registry

#### **Users Table (tbluser)**
```sql
- Uid (Primary Key)
- User (Username)
- Pass (Password Hash)
- Fullname (Full Name)
- Status (Active/Inactive)
- Role (User Role)
- AssignedSites (JSON Array)
```

#### **Sites Table (sites)**
```sql
- id (Primary Key)
- code (Site Code)
- name (Site Name)
- short_name (Short Name)
- display_name (Display Name)
- search_terms (Search Terms)
- file_name (File Name)
- province (Province)
- type (Site Type)
- database_name (Database Name)
- status (Active/Inactive)
```

### **Site-Specific Databases (art_XXXX)**
Individual databases for each health facility
**Status**: ✅ All migrated from preart_XXXX naming convention

#### **Main Patient Table (tblcimain)**
```sql
- Id (Primary Key)
- ClinicId (Unique Patient ID)
- ArtNumber (ART Number)
- FirstName (First Name)
- LastName (Last Name)
- DateOfBirth (Date of Birth)
- Sex (Gender)
- Address (Address)
- Phone (Phone Number)
- Province (Province)
- FirstVisitDate (First Visit Date)
- PatientType (Adult/Child/Infant)
- MaritalStatus (Marital Status)
- Occupation (Occupation)
- Group (Target Group)
- HouseNumber (House Number)
- Street (Street)
- District (District)
- Commune (Commune)
- Village (Village)
- Nationality (Nationality)
- TargetGroup (Target Group)
```

#### **Child Patient Table (tblcimain)**
Extended information for child patients

#### **Infant Patient Table (tbleimain)**
Extended information for infant patients

#### **Visit Tables**
- **Adult Visits**: `tblcivisit`
- **Child Visits**: `tblcivisit`
- **Infant Visits**: `tbleivisit`

#### **Test Tables**
- **Patient Tests**: `tblcitest`

#### **Status Tables**
- **Patient Status**: `tblcistatus`

---

## 🛠️ **Development Guide**

### **Prerequisites**
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- Git

### **Installation**

#### **1. Clone Repository**
```bash
git clone <repository-url>
cd artweb
```

#### **2. Backend Setup**
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database credentials
npm start
```

#### **3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

#### **4. Database Setup**
```bash
# Create registry database
mysql -u root -p
CREATE DATABASE art_sites_registry;

# Run migration scripts
cd backend
node scripts/setup-user-table.js
node scripts/populate-sites.js
```

#### **5. Database Migration (if upgrading from preart_ naming)**
```bash
# If you have existing databases with preart_ naming, run migration
cd backend
node scripts/migrate-database-names.js

# This will:
# - Create new art_ prefixed databases
# - Copy all data from old to new databases
# - Update site registry references
# - Keep old databases for safety
```

#### **6. Migration Tools Available**
- **`migrate-database-names.js`**: Complete migration script
- **`cleanup-migration.js`**: Cleanup utility for failed migrations
- **Migration Status**: ✅ Completed successfully (January 2025)

### **Project Structure**

```
artweb/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── sql-workbench/   # SQL queries
│   ├── scripts/             # Database scripts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

### **Development Commands**

#### **Backend**
```bash
npm start          # Start production server
npm run dev        # Start development server
npm test           # Run tests
npm run lint       # Run linter
```

#### **Frontend**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linter
```

### **Environment Variables**

#### **Backend (.env)**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=art_sites_registry
DB_USER=root
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=524288000
UPLOAD_PATH=./uploads
```

#### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=PreART Medical Management System
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Database Migration Issues**
```bash
# If migration fails, clean up and retry
cd backend
node scripts/cleanup-migration.js
node scripts/migrate-database-names.js

# Check migration status
mysql -u root -p -e "SHOW DATABASES LIKE 'art_%';"

# Verify site registry
mysql -u root -p art_sites_registry -e "SELECT * FROM sites;"
```

#### **Login Problems**
- **Invalid Credentials**: Check username and password
- **Account Disabled**: Contact administrator
- **Network Error**: Check internet connection

#### **Data Loading Issues**
- **Site Not Found**: Verify site code exists
- **Permission Denied**: Check user role and site assignment
- **Database Connection**: Verify database connectivity

#### **Import Data Issues**
- **File Too Large**: Ensure file is under 500MB
- **Invalid SQL**: Check SQL file format
- **Site Already Exists**: Use existing site or different code

#### **Performance Issues**
- **Slow Loading**: Check network connection
- **Memory Issues**: Close other applications
- **Database Timeout**: Contact system administrator

### **Error Messages**

#### **Authentication Errors**
- `Invalid username or password`: Check credentials
- `Account disabled`: Contact administrator
- `Token expired`: Logout and login again

#### **Permission Errors**
- `Access denied`: Insufficient permissions
- `Site not assigned`: Contact administrator
- `Role required`: Upgrade user role

#### **Data Errors**
- `Site not found`: Verify site code
- `Patient not found`: Check patient ID
- `Validation failed`: Check required fields

---

## 🆘 **Support & Maintenance**

### **System Requirements**

#### **Minimum Requirements**
- **RAM**: 4GB
- **Storage**: 10GB free space
- **CPU**: 2 cores
- **Network**: Stable internet connection

#### **Recommended Requirements**
- **RAM**: 8GB or more
- **Storage**: 50GB free space
- **CPU**: 4 cores or more
- **Network**: High-speed internet connection

### **Backup Procedures**

#### **Database Backup**
```bash
# Backup registry database
mysqldump -u root -p art_sites_registry > registry_backup.sql

# Backup site databases
mysqldump -u root -p art_0201 > site_0201_backup.sql
```

#### **File Backup**
- Regular backup of uploaded files
- Configuration file backups
- Log file archives

### **Maintenance Tasks**

#### **Daily**
- Monitor system performance
- Check error logs
- Verify data integrity

#### **Weekly**
- Database optimization
- Log file cleanup
- Security updates

#### **Monthly**
- Full system backup
- Performance analysis
- User access review

### **Contact Information**

#### **Technical Support**
- **Email**: daracheol@gmil.com
- **Phone**: +855-15-268-853
- **Hours**: Monday-Friday, 8AM-5PM

---

## 📝 **Changelog**

### **Version 2.1.0** (Current - January 2025)
- ✅ **Database Migration**: Successfully migrated from preart_ to art_ naming convention
- ✅ **7 Databases Migrated**: All site and registry databases updated
- ✅ **Data Integrity**: 100% data preservation during migration
- ✅ **Migration Tools**: Added comprehensive migration and cleanup scripts
- Complete UI redesign with modern interface
- Enhanced role-based access control
- Improved data import/export functionality
- Advanced reporting and analytics
- Mobile-responsive design
- Performance optimizations

### **Version 1.0.0**
- Initial release
- Basic patient management
- Simple reporting
- Multi-site support

---

## 📄 **License**

This software is proprietary and confidential. All rights reserved.

---

**Last Updated**: Oct 2025  
**Version**: 2.0.0  
**Documentation Version**: 1.0.0
