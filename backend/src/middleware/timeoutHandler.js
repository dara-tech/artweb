// Timeout handler middleware
const timeoutHandler = (timeoutMs = 60000) => {
  return (req, res, next) => {
    // Set a timeout for the request
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        console.error(`⏰ Request timeout after ${timeoutMs}ms: ${req.method} ${req.originalUrl}`);
        res.status(408).json({
          success: false,
          error: 'Request timeout',
          message: `Request took longer than ${timeoutMs/1000} seconds to complete`,
          timeout: true
        });
      }
    }, timeoutMs);

    // Clear timeout when response is sent
    res.on('finish', () => {
      clearTimeout(timeout);
    });

    res.on('close', () => {
      clearTimeout(timeout);
    });

    next();
  };
};

module.exports = timeoutHandler;
