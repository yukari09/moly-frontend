# Analytics and Monitoring Implementation

This document describes the comprehensive analytics and monitoring system implemented for the AI prompt generator platform.

## Overview

The monitoring system provides:
- **Google Analytics 4 integration** for user behavior tracking
- **Performance monitoring** for API response times and Core Web Vitals
- **Error monitoring** with detailed context and logging
- **Conversion tracking** for prompt optimizations and user interactions
- **Real-time monitoring dashboard** for development and debugging

## Components

### 1. Google Analytics Integration (`src/components/Analytics.js`)

**Features:**
- Automatic page view tracking
- Custom event tracking for user interactions
- Conversion tracking for business metrics
- Error tracking with context
- Performance metrics tracking

**Usage:**
```javascript
import { analytics } from '@/components/Analytics';

// Track user interactions
analytics.trackInteraction('button_click', 'engagement', 'optimize_button', 1);

// Track conversions
analytics.trackConversion('prompt_optimization', { generator_type: 'writing' });

// Track errors
analytics.trackError(error, { component: 'KariOptimizer', action: 'optimization' });
```

### 2. Performance Monitoring (`src/lib/monitoring.js`)

**Features:**
- API response time monitoring
- Performance metrics collection
- Automatic timing for operations
- Web Vitals monitoring (LCP, FID, CLS)

**Usage:**
```javascript
import { performanceMonitor } from '@/lib/monitoring';

// Monitor API calls
const result = await performanceMonitor.monitorApiCall('/api/endpoint', async () => {
  return await fetch('/api/endpoint');
});

// Manual timing
performanceMonitor.startTiming('operation_name');
// ... perform operation
const duration = performanceMonitor.endTiming('operation_name');
```

### 3. Error Monitoring (`src/lib/monitoring.js`)

**Features:**
- Centralized error logging
- Context-aware error tracking
- Error statistics and analysis
- Integration with Google Analytics

**Usage:**
```javascript
import { errorMonitor } from '@/lib/monitoring';

// Log errors with context
errorMonitor.logError(error, {
  component: 'ComponentName',
  action: 'user_action',
  userId: 'user123'
});

// Get error statistics
const stats = errorMonitor.getErrorStats();
```

### 4. React Hooks (`src/hooks/useMonitoring.js`)

**Features:**
- Component-level monitoring
- Form interaction tracking
- Page view tracking
- Automatic error boundary integration

**Usage:**
```javascript
import { useMonitoring, useFormMonitoring } from '@/hooks/useMonitoring';

function MyComponent() {
  const { startTiming, endTiming, logError, monitorApiCall } = useMonitoring('MyComponent');
  const { trackFormStart, trackFormSubmit } = useFormMonitoring('my_form');

  const handleSubmit = async () => {
    trackFormStart();
    try {
      const result = await monitorApiCall('/api/submit', submitData);
      trackFormSubmit(true);
    } catch (error) {
      logError(error, { action: 'form_submit' });
      trackFormSubmit(false, error.message);
    }
  };
}
```

## Configuration

### Environment Variables

Add to your `.env.local`:
```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Layout Integration

The Google Analytics component is automatically included in the root layout:

```javascript
// src/app/[locale]/layout.js
import { GoogleAnalytics } from "@/components/Analytics";

export default function RootLayout({ children, params }) {
  return (
    <html>
      <body>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        {children}
      </body>
    </html>
  );
}
```

## Tracked Events

### User Interactions
- **Form interactions**: Focus, blur, submit
- **Button clicks**: Optimize, copy, save, regenerate
- **Navigation**: Page views, route changes
- **Generator usage**: Start, complete, error

### Performance Metrics
- **API response times**: All API endpoints
- **Core Web Vitals**: LCP, FID, CLS
- **Component render times**: Critical components
- **Error rates**: By component and endpoint

### Conversions
- **Prompt optimizations**: Success/failure rates
- **User engagement**: Copy, save, regenerate actions
- **Generator usage**: By type and platform
- **Error recovery**: Retry success rates

## Monitoring Dashboard

A development dashboard is available at `/monitoring` (when enabled):

**Features:**
- Real-time performance metrics
- Error statistics and recent errors
- API response time analysis
- Conversion tracking overview

**Usage:**
```javascript
import { MonitoringDashboard } from '@/components/MonitoringDashboard';

// Add to a development page
function DevPage() {
  return <MonitoringDashboard />;
}
```

## KariOptimizer Integration

The KariOptimizer component includes comprehensive monitoring:

### Tracked Events
1. **Form interactions**: Input focus/blur, platform/mode changes
2. **Optimization requests**: Start, success, failure with timing
3. **User actions**: Copy, save, regenerate prompts
4. **Error handling**: API errors, validation errors, network issues

### Performance Tracking
- Optimization request timing
- API response time monitoring
- Error rate tracking by generator type
- User engagement metrics

### Example Implementation
```javascript
// The KariOptimizer automatically tracks:
const handleOptimize = async () => {
  trackFormSubmit(false); // Track attempt
  startTiming('optimization_request');
  
  try {
    const result = await monitorApiCall('/api/kari/optimize', optimizePrompt);
    trackConversion.trackOptimizationSuccess(result);
    trackFormSubmit(true); // Track success
  } catch (error) {
    logError(error, { action: 'optimization_request' });
    trackFormSubmit(false, error.message);
  } finally {
    endTiming('optimization_request');
  }
};
```

## API Monitoring

The Kari API endpoint includes monitoring:

### Tracked Metrics
- Request processing time
- Gemini API response time
- Error rates and types
- Request validation failures

### Error Handling
- Detailed error logging with context
- Performance impact tracking
- Automatic retry logic monitoring

## Testing

Comprehensive tests are included:

```bash
# Run analytics and monitoring tests
npm test src/test/analytics-monitoring.test.js

# Run integration tests
npm test src/test/kari-monitoring-integration.test.jsx
```

## Best Practices

### 1. Error Handling
- Always provide context when logging errors
- Use appropriate error categories
- Include user-friendly error messages

### 2. Performance Monitoring
- Monitor critical user paths
- Set performance budgets
- Track Core Web Vitals

### 3. Privacy Compliance
- Respect user privacy settings
- Implement proper consent management
- Anonymize sensitive data

### 4. Data Analysis
- Set up custom dashboards in Google Analytics
- Monitor conversion funnels
- Track user journey optimization

## Troubleshooting

### Common Issues

1. **Google Analytics not tracking**
   - Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
   - Check browser console for errors
   - Ensure ad blockers aren't interfering

2. **Performance monitoring not working**
   - Check browser support for Performance API
   - Verify timing calls are properly paired
   - Monitor console for timing errors

3. **Error monitoring missing context**
   - Ensure error boundaries are properly set up
   - Verify context is passed to error logging
   - Check component naming consistency

### Debug Mode

Enable debug logging in development:
```javascript
// The monitoring system automatically logs to console in development
// Check browser console for detailed monitoring information
```

## Future Enhancements

Planned improvements:
- Real-time alerting for critical errors
- Advanced user behavior analysis
- A/B testing framework integration
- Custom metric dashboards
- Automated performance regression detection

## Support

For issues or questions about the monitoring system:
1. Check the test files for usage examples
2. Review the monitoring dashboard for real-time data
3. Examine console logs in development mode
4. Refer to Google Analytics documentation for advanced features