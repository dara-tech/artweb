const progressTracker = (req, res, next) => {
  // Add progress tracking to response
  const originalSend = res.send;
  const originalJson = res.json;
  
  let progress = 0;
  const maxProgress = 100;
  
  // Create progress tracking object
  const progressData = {
    progress: 0,
    status: 'loading',
    message: 'Processing request...',
    details: []
  };
  
  // Override res.json to include progress
  res.json = function(data) {
    if (data && typeof data === 'object') {
      data.progress = progressData;
    }
    return originalJson.call(this, data);
  };
  
  // Override res.send to include progress
  res.send = function(data) {
    if (data && typeof data === 'object') {
      data.progress = progressData;
    }
    return originalSend.call(this, data);
  };
  
  // Add progress tracking methods to response
  res.updateProgress = (newProgress, message, details = []) => {
    progressData.progress = Math.min(Math.max(newProgress, 0), 100);
    progressData.message = message || progressData.message;
    progressData.details = details.length > 0 ? details : progressData.details;
    
    // Send progress update via Server-Sent Events if available
    if (res.sse) {
      res.sse.write(`data: ${JSON.stringify(progressData)}\n\n`);
    }
  };
  
  res.setProgressStatus = (status, message) => {
    progressData.status = status;
    progressData.message = message;
    
    if (res.sse) {
      res.sse.write(`data: ${JSON.stringify(progressData)}\n\n`);
    }
  };
  
  res.completeProgress = (message = 'Request completed successfully') => {
    progressData.progress = 100;
    progressData.status = 'completed';
    progressData.message = message;
    
    if (res.sse) {
      res.sse.write(`data: ${JSON.stringify(progressData)}\n\n`);
      res.sse.end();
    }
  };
  
  res.errorProgress = (message = 'Request failed') => {
    progressData.status = 'error';
    progressData.message = message;
    
    if (res.sse) {
      res.sse.write(`data: ${JSON.stringify(progressData)}\n\n`);
      res.sse.end();
    }
  };
  
  next();
};

module.exports = progressTracker;
