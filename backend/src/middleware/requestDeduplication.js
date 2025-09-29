const { performance } = require('perf_hooks');

// Request deduplication middleware
class RequestDeduplication {
  constructor() {
    this.pendingRequests = new Map();
    this.requestTimeouts = new Map();
  }

  // Generate a unique key for the request
  generateKey(req) {
    const { method, originalUrl, query, body } = req;
    return `${method}:${originalUrl}:${JSON.stringify(query)}:${JSON.stringify(body)}`;
  }

  // Middleware function
  middleware() {
    return (req, res, next) => {
      const key = this.generateKey(req);
      const now = performance.now();

      // Check if there's already a pending request for this key
      if (this.pendingRequests.has(key)) {
        const pendingRequest = this.pendingRequests.get(key);
        const timeSinceStart = now - pendingRequest.startTime;

        // If request is still pending and less than 30 seconds old, wait for it
        if (timeSinceStart < 30000) {
          console.log(`🔄 Deduplicating request: ${req.originalUrl}`);
          
          // Wait for the pending request to complete
          pendingRequest.promise.then(
            (result) => {
              res.json(result);
            },
            (error) => {
              res.status(500).json({
                success: false,
                error: 'Request failed',
                message: error.message
              });
            }
          );
          return;
        } else {
          // Request is too old, remove it and proceed
          this.pendingRequests.delete(key);
          if (this.requestTimeouts.has(key)) {
            clearTimeout(this.requestTimeouts.get(key));
            this.requestTimeouts.delete(key);
          }
        }
      }

      // Create a new pending request
      const requestPromise = new Promise((resolve, reject) => {
        // Store the resolve/reject functions
        req._deduplicationResolve = resolve;
        req._deduplicationReject = reject;
      });

      this.pendingRequests.set(key, {
        promise: requestPromise,
        startTime: now
      });

      // Set a timeout to clean up the request
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(key);
        this.requestTimeouts.delete(key);
      }, 30000); // 30 seconds timeout

      this.requestTimeouts.set(key, timeout);

      // Override res.json to handle completion
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        // Clean up the pending request
        this.pendingRequests.delete(key);
        if (this.requestTimeouts.has(key)) {
          clearTimeout(this.requestTimeouts.get(key));
          this.requestTimeouts.delete(key);
        }

        // Resolve the promise for waiting requests
        if (req._deduplicationResolve) {
          req._deduplicationResolve(data);
        }

        return originalJson(data);
      };

      // Override res.status().json() as well
      const originalStatus = res.status.bind(res);
      res.status = (code) => {
        const statusRes = originalStatus(code);
        const originalStatusJson = statusRes.json.bind(statusRes);
        
        statusRes.json = (data) => {
          // Clean up the pending request
          this.pendingRequests.delete(key);
          if (this.requestTimeouts.has(key)) {
            clearTimeout(this.requestTimeouts.get(key));
            this.requestTimeouts.delete(key);
          }

          // Resolve the promise for waiting requests
          if (req._deduplicationResolve) {
            req._deduplicationResolve(data);
          }

          return originalStatusJson(data);
        };
        
        return statusRes;
      };

      next();
    };
  }

  // Get statistics
  getStats() {
    return {
      pendingRequests: this.pendingRequests.size,
      activeTimeouts: this.requestTimeouts.size,
      pendingKeys: Array.from(this.pendingRequests.keys())
    };
  }

  // Clear all pending requests
  clear() {
    this.pendingRequests.clear();
    this.requestTimeouts.forEach(timeout => clearTimeout(timeout));
    this.requestTimeouts.clear();
  }
}

// Create singleton instance
const requestDeduplication = new RequestDeduplication();

module.exports = requestDeduplication;
