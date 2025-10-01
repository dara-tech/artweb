# PreART Frontend

Modern React-based frontend for the PreART Medical Management System, built with Vite and Tailwind CSS.

## 🚀 **Quick Start**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ **Technology Stack**

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   ├── layout/         # Layout components (Sidebar, Header)
│   ├── common/         # Common components (SiteFilter, etc.)
│   └── modals/         # Modal components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── indicators/     # Indicators reporting pages
│   ├── patients/       # Patient management pages
│   └── ...
├── services/           # API service functions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🎨 **UI Components**

### **Base Components**
- `Button` - Customizable button component
- `Card` - Content container with variants
- `Input` - Form input with validation
- `Select` - Dropdown selection component
- `Badge` - Status and label indicators
- `Toast` - Notification system

### **Layout Components**
- `AdvancedLayout` - Main application layout
- `Sidebar` - Navigation sidebar (hidden for viewers)
- `SiteFilter` - Site selection component

### **Feature Components**
- `IndicatorsReport` - Main indicators reporting page
- `IndicatorDetailsModal` - Detailed indicator view
- `PatientList` - Patient management interface

## 🔧 **Key Features**

### **Role-Based Access Control**
- **Viewers**: Read-only access to indicators
- **Admins**: Full system access
- **Doctors/Nurses**: Patient management access

### **Site Management**
- **Multi-Site Support**: Switch between health facilities
- **File Name Integration**: Unique file identifiers
- **Site-Specific Data**: Individual facility reporting

### **Reporting System**
- **Real-Time Indicators**: Live ART performance data
- **Category Filtering**: Organized indicator categories
- **Export Capabilities**: CSV export functionality
- **Performance Monitoring**: System health tracking

## 🎯 **Development Guidelines**

### **Component Structure**
```jsx
// Example component structure
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-4">
      <Button variant="primary">
        Click me
      </Button>
    </div>
  );
};

export default MyComponent;
```

### **Styling Guidelines**
- Use Tailwind CSS classes for styling
- Follow the design system patterns
- Use CSS variables for theming
- Maintain responsive design principles

### **State Management**
- Use React Context for global state
- Use local state for component-specific data
- Use custom hooks for reusable logic

## 📱 **Responsive Design**

The application is fully responsive and works on:
- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with mobile menu

## 🔐 **Authentication**

The frontend integrates with the backend authentication system:
- JWT token management
- Automatic token refresh
- Role-based route protection
- Secure API communication

## 🚀 **Performance**

- **Vite Build System**: Fast development and production builds
- **Code Splitting**: Automatic code splitting for optimal loading
- **Tree Shaking**: Unused code elimination
- **Optimized Assets**: Compressed images and assets

## 🧪 **Testing**

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 **Build & Deployment**

### **Development Build**
```bash
npm run dev
# Starts development server at http://localhost:5173
```

### **Production Build**
```bash
npm run build
# Creates optimized build in dist/ folder
```

### **Preview Production Build**
```bash
npm run preview
# Preview the production build locally
```

## 🔧 **Configuration**

### **Environment Variables**
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=PreART Medical System
```

### **Vite Configuration**
The project uses Vite with React plugin and path aliases:
- `@/` - Points to `src/` directory
- `@/components/` - UI components
- `@/contexts/` - React contexts
- `@/services/` - API services

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Medical blue theme
- **Secondary**: Success green
- **Warning**: Alert orange
- **Destructive**: Error red
- **Muted**: Neutral grays

### **Typography**
- **Headings**: Bold, clear hierarchy
- **Body**: Readable font sizes
- **Code**: Monospace for technical content

### **Spacing**
- Consistent spacing scale using Tailwind's spacing system
- 4px base unit for consistent layouts

## 🤝 **Contributing**

1. Follow the existing code structure
2. Use TypeScript for new components (when applicable)
3. Write clean, readable code
4. Test your changes thoroughly
5. Follow the design system guidelines

## 📚 **Resources**

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

**PreART Frontend** - Modern, accessible, and performant user interface for medical management.