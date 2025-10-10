# Analytics Engine Toast Notifications Guide

## Overview

The Analytics Engine now uses **toast notifications** instead of a widget to show system status and provide quick actions. This provides a cleaner UI while keeping you informed about the analytics engine status.

## 🎯 **How It Works**

### **Automatic Notifications**
- **On App Load**: Shows analytics engine status after 2 seconds
- **Periodic Checks**: Every 5 minutes, shows status if there are issues
- **Status-Based**: Different toast types based on system health

### **Toast Types**
1. **🟢 Success Toast**: System healthy (90%+ success rate)
2. **🟡 Warning Toast**: System degraded (50-89% success rate)  
3. **🔴 Error Toast**: System issues (<50% success rate)
4. **ℹ️ Info Toast**: No data yet, ready to calculate

## 🚀 **Quick Actions**

### **Analytics Button**
- **Location**: In the report configuration panel (purple Activity icon)
- **Click**: Shows quick actions menu
- **Available to**: Admin and Super Admin users only

### **Available Actions**
1. **Quick Calculate**: Calculate a sample indicator
2. **Check Status**: View current system health
3. **View Details**: Open analytics admin panel
4. **More Options**: Access full admin interface

## 📱 **Toast Features**

### **Interactive Toasts**
- **Action Buttons**: Each toast has relevant action buttons
- **Auto-Dismiss**: Toasts disappear after 3-10 seconds based on importance
- **Manual Dismiss**: Click the X to close manually

### **Toast Content**
- **Title**: Clear status message
- **Description**: Detailed information about the system
- **Actions**: Relevant buttons for next steps

## 🔧 **Usage Examples**

### **Check Analytics Status**
```javascript
// In browser console or code
window.analyticsToast.checkStatus();
```

### **Quick Calculate**
```javascript
// Trigger a sample calculation
window.analyticsToast.quickCalculate();
```

### **Show All Actions**
```javascript
// Show the quick actions menu
window.analyticsToast.showActions();
```

## 📊 **Status Indicators**

### **Healthy System** 🟢
- **Success Rate**: 90% or higher
- **Toast**: Green success notification
- **Frequency**: Shows every 5 minutes
- **Action**: "View Details" button

### **Degraded System** 🟡
- **Success Rate**: 50-89%
- **Toast**: Yellow warning notification
- **Frequency**: Shows immediately when detected
- **Action**: "Check Status" button

### **System Issues** 🔴
- **Success Rate**: Less than 50%
- **Toast**: Red error notification
- **Frequency**: Shows immediately when detected
- **Action**: "Fix Issues" button

### **No Data** ℹ️
- **Records**: 0 calculated indicators
- **Toast**: Blue info notification
- **Frequency**: Shows on first load
- **Action**: "Calculate Now" button

## 🎨 **Visual Design**

### **Toast Styling**
- **Position**: Top-right corner
- **Colors**: Rich colors for different status types
- **Icons**: Relevant icons for each action
- **Animations**: Smooth slide-in/out transitions

### **Button Styling**
- **Analytics Button**: Purple theme with Activity icon
- **Hover Effects**: Scale and color transitions
- **Tooltip**: "Analytics Engine" on hover

## 🔄 **Automatic Behavior**

### **Initial Load**
1. App starts
2. Wait 2 seconds
3. Check analytics status
4. Show appropriate toast

### **Periodic Monitoring**
1. Every 5 minutes
2. Check system health
3. Show toast if status changed
4. Update internal state

### **User Interactions**
1. Click analytics button
2. Show quick actions
3. Execute selected action
4. Show result toast

## 🛠️ **Admin Panel Access**

### **Direct Access**
- **URL**: `/analytics-admin`
- **Access**: Admin and Super Admin only
- **Features**: Full analytics management interface

### **Quick Access**
- **From Toast**: Click "View Details" button
- **From Button**: Click "More Options" in quick actions
- **From Console**: `window.open('/analytics-admin', '_blank')`

## 📈 **Benefits**

### **Clean UI**
- **No Widget**: Removes visual clutter
- **On-Demand**: Only shows when needed
- **Contextual**: Relevant information at the right time

### **Better UX**
- **Non-Intrusive**: Doesn't block main content
- **Informative**: Clear status and actions
- **Interactive**: Easy to take action

### **Performance**
- **Lightweight**: Minimal resource usage
- **Efficient**: Only checks when needed
- **Responsive**: Quick feedback on actions

## 🚨 **Troubleshooting**

### **No Toasts Appearing**
1. Check if analytics engine is running
2. Verify API endpoints are accessible
3. Check browser console for errors

### **Toasts Not Interactive**
1. Ensure `window.analyticsToast` is available
2. Check if toast library is loaded
3. Verify button click handlers

### **Status Not Updating**
1. Check network connectivity
2. Verify analytics API responses
3. Clear browser cache if needed

## 🎯 **Best Practices**

### **For Users**
- **Check Status**: Click analytics button to see current status
- **Quick Actions**: Use toast action buttons for common tasks
- **Admin Panel**: Use for detailed management and monitoring

### **For Developers**
- **Global Access**: Use `window.analyticsToast` for programmatic access
- **Error Handling**: Always check if functions exist before calling
- **User Feedback**: Show appropriate toasts for user actions

The toast notification system provides a clean, efficient way to monitor and interact with the analytics engine without cluttering the main interface! 🎉
