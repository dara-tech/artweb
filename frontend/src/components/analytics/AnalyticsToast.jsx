import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import analyticsApi from '../../services/analyticsApi';

// Helper function to check if current user is a viewer
const isViewerUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Decode JWT token (simple base64 decode of payload)
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    // Check if user role is 'viewer'
    return decodedPayload.role === 'viewer';
  } catch (error) {
    // If there's any error decoding, allow toasts to show
    return false;
  }
};

const AnalyticsToast = () => {
  const [summary, setSummary] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);

  const fetchSummary = async () => {
    try {
      const data = await analyticsApi.getAnalyticsSummary();
      
      if (data.success) {
        setSummary(data.data);
        setLastCheck(Date.now());
        
        // Don't show toasts for viewer users
        if (isViewerUser()) return;
        
        const successRate = parseFloat(data.data.successRate) || 0;
        const totalRecords = data.data.totalRecords || 0;
        
        if (totalRecords === 0) {
          toast.info("Analytics Ready", {
            description: "No data calculated yet. ",
            // action: { label: "Calculate", onClick: () => triggerQuickCalculation() },
            duration: 5000
          });
        } else if (successRate >= 90) {
          const timeSinceLastCheck = lastCheck ? Date.now() - lastCheck : Infinity;
          if (timeSinceLastCheck > 300000) {
            toast.success("Analytics Healthy", {
              description: `${data.data.completedRecords} indicators calculated (${successRate}% success)`,
            //   action: { label: "Details", onClick: () => window.open('/analytics-admin', '_blank') },
              duration: 3000
            });
          }
        } else if (successRate >= 50) {
          toast.warning("Analytics Degraded", {
            description: `${successRate}% success rate. ${data.data.failedRecords} failures.`,
            // action: { label: "Check", onClick: () => window.open('/analytics-admin', '_blank') },
            duration: 8000
          });
        } else {
          toast.error("Analytics Issues", {
            description: `Low success: ${successRate}%. ${data.data.failedRecords} failures.`,
            // action: { label: "Fix", onClick: () => window.open('/analytics-admin', '_blank') },
            duration: 10000
          });
        }
      } else {
        // Don't show error toasts for viewers
        if (isViewerUser()) return;
        
        toast.error("Analytics Error", {
          description: data.message || "Service connection failed",
        //   action: { label: "Retry", onClick: () => fetchSummary() },
          duration: 8000
        });
      }
    } catch (err) {
      // Don't show error toasts for viewers
      if (isViewerUser()) return;
      
      toast.error("Connection Failed", {
        description: `Cannot connect: ${err.message}`,
        // action: { label: "Retry", onClick: () => fetchSummary() },
        duration: 8000
      });
    }
  };

//   const triggerQuickCalculation = async () => {
//     try {
//       toast.loading("Calculating...", { id: "calc" });

//       const data = await analyticsApi.batchCalculate([{
//         indicatorId: '1',
//         siteCode: '2101',
//         period: {
//           periodType: 'quarterly',
//           periodYear: 2025,
//           periodQuarter: 2,
//           startDate: '2025-04-01',
//           endDate: '2025-06-30',
//           previousEndDate: '2025-03-31'
//         }
//       }]);
      
//       if (data.success) {
//         toast.success("Complete!", {
//           id: "calc",
//           description: "Indicator calculated successfully",
//           action: { label: "View", onClick: () => window.open('/analytics-admin', '_blank') }
//         });
//         await fetchSummary();
//       } else {
//         toast.error("Failed", {
//           id: "calc",
//           description: data.message || "Calculation failed",
//           action: { label: "Retry", onClick: () => triggerQuickCalculation() }
//         });
//       }
//     } catch (err) {
//       toast.error("Error", {
//         id: "calc",
//         description: "Calculation failed",
//         action: { label: "Retry", onClick: () => triggerQuickCalculation() }
//       });
//     }
//   };

  const showAnalyticsStatus = () => {
    // Don't show toasts for viewer users
    if (isViewerUser()) return;
    
    if (!summary) {
      toast.info("Checking status...", {
        action: { label: "Check", onClick: () => fetchSummary() }
      });
      return;
    }

    const successRate = parseFloat(summary.successRate) || 0;
    const status = successRate >= 90 ? 'success' : successRate >= 50 ? 'warning' : 'error';
    
    const messages = {
      success: [`Analytics Healthy`, `${summary.completedRecords} calculated (${successRate}%)`],
      warning: [`Analytics Degraded`, `${successRate}% success, ${summary.failedRecords} failed`],
      error: [`Analytics Issues`, `Low success: ${successRate}%, ${summary.failedRecords} failed`]
    };

    const [title, description] = messages[status];
    
    toast[status](title, {
      description,
      action: { label: "Details", onClick: () => window.open('/analytics-admin', '_blank') },
      duration: 8000
    });
  };

  // Initial check
  useEffect(() => {
    const timer = setTimeout(() => fetchSummary(), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Periodic checks
  useEffect(() => {
    const interval = setInterval(() => fetchSummary(), 300000);
    return () => clearInterval(interval);
  }, []);

  // Global access
  useEffect(() => {
    window.analyticsToast = {
      checkStatus: fetchSummary,
      showStatus: showAnalyticsStatus,
    //   quickCalculate: triggerQuickCalculation
    };
  }, [summary]);

  return null;
};

export default AnalyticsToast;
