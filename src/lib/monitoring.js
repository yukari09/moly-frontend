import { analytics } from '@/components/Analytics';

// Performance monitoring utilities
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.apiMetrics = new Map();
  }

  // Start timing a metric
  startTiming(metricName) {
    this.metrics.set(metricName, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  // End timing and track the metric
  endTiming(metricName, context = {}) {
    const metric = this.metrics.get(metricName);
    if (!metric) {
      console.warn(`Performance metric "${metricName}" was not started`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Track with analytics
    analytics.trackPerformance(metricName, metric.duration, context);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${metricName}: ${metric.duration.toFixed(2)}ms`, context);
    }

    return metric.duration;
  }

  // Monitor API calls
  async monitorApiCall(endpoint, apiCall, context = {}) {
    const startTime = performance.now();
    let status = 'unknown';
    let error = null;

    try {
      const result = await apiCall();
      status = result?.status || 'success';
      return result;
    } catch (err) {
      error = err;
      status = 'error';
      throw err;
    } finally {
      const responseTime = performance.now() - startTime;
      
      // Track API response time
      analytics.trackApiResponse(endpoint, responseTime, status, error);
      
      // Store metrics for analysis
      this.apiMetrics.set(`${endpoint}_${Date.now()}`, {
        endpoint,
        responseTime,
        status,
        error: error?.message || null,
        timestamp: new Date().toISOString(),
        context
      });

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        const statusEmoji = status === 'error' ? '❌' : status === 'success' ? '✅' : '⚠️';
        console.log(`${statusEmoji} API ${endpoint}: ${responseTime.toFixed(2)}ms (${status})`, context);
        if (error) {
          console.error('API Error:', error);
        }
      }
    }
  }

  // Get performance metrics summary
  getMetricsSummary() {
    const apiMetricsArray = Array.from(this.apiMetrics.values());
    const recentMetrics = apiMetricsArray.slice(-50); // Last 50 API calls

    return {
      totalApiCalls: apiMetricsArray.length,
      recentApiCalls: recentMetrics.length,
      averageResponseTime: recentMetrics.length > 0 
        ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length 
        : 0,
      errorRate: recentMetrics.length > 0 
        ? recentMetrics.filter(m => m.status === 'error').length / recentMetrics.length 
        : 0,
      slowestEndpoint: recentMetrics.length > 0 
        ? recentMetrics.reduce((slowest, current) => 
            current.responseTime > slowest.responseTime ? current : slowest
          )
        : null
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Error monitoring utilities
export class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Keep last 100 errors
  }

  // Log and track errors
  logError(error, context = {}) {
    const errorInfo = {
      message: error.message || 'Unknown error',
      stack: error.stack || 'No stack trace',
      timestamp: new Date().toISOString(),
      context: {
        component: context.component || 'unknown',
        action: context.action || 'unknown',
        userId: context.userId || null,
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
        ...context
      }
    };

    // Add to local error log
    this.errors.unshift(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Track with analytics
    analytics.trackError(error, context);

    // Console logging with context
    console.error('🚨 Error logged:', {
      message: error.message,
      component: context.component,
      action: context.action,
      timestamp: errorInfo.timestamp
    });

    // In development, also log the full error
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
      console.error('Error context:', context);
    }

    return errorInfo;
  }

  // Get recent errors
  getRecentErrors(limit = 10) {
    return this.errors.slice(0, limit);
  }

  // Get error statistics
  getErrorStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const recentErrors = this.errors.filter(e => 
      new Date(e.timestamp).getTime() > oneHourAgo
    );
    const dailyErrors = this.errors.filter(e => 
      new Date(e.timestamp).getTime() > oneDayAgo
    );

    return {
      totalErrors: this.errors.length,
      errorsLastHour: recentErrors.length,
      errorsLastDay: dailyErrors.length,
      mostCommonError: this.getMostCommonError(),
      errorsByComponent: this.getErrorsByComponent()
    };
  }

  getMostCommonError() {
    const errorCounts = {};
    this.errors.forEach(error => {
      const key = error.message;
      errorCounts[key] = (errorCounts[key] || 0) + 1;
    });

    let mostCommon = null;
    let maxCount = 0;
    Object.entries(errorCounts).forEach(([message, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = { message, count };
      }
    });

    return mostCommon;
  }

  getErrorsByComponent() {
    const componentCounts = {};
    this.errors.forEach(error => {
      const component = error.context.component || 'unknown';
      componentCounts[component] = (componentCounts[component] || 0) + 1;
    });
    return componentCounts;
  }
}

// Global error monitor instance
export const errorMonitor = new ErrorMonitor();

// Conversion tracking utilities
export const conversionTracking = {
  // Track when user starts using a generator
  trackGeneratorStart: (generatorType, platform) => {
    analytics.trackInteraction('generator_start', 'engagement', generatorType, 1);
    analytics.trackConversion('generator_usage', {
      generator_type: generatorType,
      platform: platform,
      step: 'start'
    });
  },

  // Track successful prompt optimization
  trackOptimizationSuccess: (data) => {
    analytics.trackPromptOptimization(data);
    analytics.trackConversion('prompt_optimization', {
      generator_type: data.generatorType,
      platform: data.platform,
      mode: data.mode,
      success: true,
      processing_time: data.processingTime
    });
  },

  // Track user copying optimized prompt
  trackPromptCopy: (generatorType, platform) => {
    analytics.trackInteraction('prompt_copy', 'engagement', generatorType, 1);
    analytics.trackConversion('prompt_copy', {
      generator_type: generatorType,
      platform: platform
    });
  },

  // Track user saving prompt
  trackPromptSave: (generatorType, platform) => {
    analytics.trackInteraction('prompt_save', 'engagement', generatorType, 1);
    analytics.trackConversion('prompt_save', {
      generator_type: generatorType,
      platform: platform
    });
  },

  // Track user regenerating prompt
  trackPromptRegenerate: (generatorType, platform) => {
    analytics.trackInteraction('prompt_regenerate', 'engagement', generatorType, 1);
    analytics.trackConversion('prompt_regenerate', {
      generator_type: generatorType,
      platform: platform
    });
  }
};

// Web Vitals monitoring
export const webVitalsMonitor = {
  // Monitor Core Web Vitals
  initWebVitals: () => {
    if (typeof window === 'undefined') return;

    // Monitor Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      analytics.trackPerformance('LCP', lastEntry.startTime, {
        metric_type: 'core_web_vital'
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        analytics.trackPerformance('FID', entry.processingStart - entry.startTime, {
          metric_type: 'core_web_vital'
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Monitor Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      analytics.trackPerformance('CLS', clsValue, {
        metric_type: 'core_web_vital'
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
};