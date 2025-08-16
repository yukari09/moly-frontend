'use client';

import { useEffect, useCallback } from 'react';
import { performanceMonitor, errorMonitor, conversionTracking } from '@/lib/monitoring';

// Custom hook for component-level monitoring
export function useMonitoring(componentName) {
  // Error boundary effect
  useEffect(() => {
    const handleError = (event) => {
      errorMonitor.logError(event.error, {
        component: componentName,
        action: 'unhandled_error',
        type: 'window_error'
      });
    };

    const handleUnhandledRejection = (event) => {
      errorMonitor.logError(new Error(event.reason), {
        component: componentName,
        action: 'unhandled_promise_rejection',
        type: 'promise_error'
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [componentName]);

  // Performance monitoring functions
  const startTiming = useCallback((metricName) => {
    performanceMonitor.startTiming(`${componentName}_${metricName}`);
  }, [componentName]);

  const endTiming = useCallback((metricName, context = {}) => {
    return performanceMonitor.endTiming(`${componentName}_${metricName}`, {
      component: componentName,
      ...context
    });
  }, [componentName]);

  // Error logging function
  const logError = useCallback((error, context = {}) => {
    return errorMonitor.logError(error, {
      component: componentName,
      ...context
    });
  }, [componentName]);

  // API monitoring function
  const monitorApiCall = useCallback(async (endpoint, apiCall, context = {}) => {
    return performanceMonitor.monitorApiCall(endpoint, apiCall, {
      component: componentName,
      ...context
    });
  }, [componentName]);

  return {
    startTiming,
    endTiming,
    logError,
    monitorApiCall,
    trackConversion: conversionTracking
  };
}

// Hook for monitoring page views
export function usePageView(pageName, additionalData = {}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...additionalData
      });
    }
  }, [pageName, additionalData]);
}

// Hook for monitoring form interactions
export function useFormMonitoring(formName) {
  const trackFormStart = useCallback(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_start', {
        event_category: 'engagement',
        event_label: formName
      });
    }
  }, [formName]);

  const trackFormSubmit = useCallback((success = true, errorMessage = null) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submit', {
        event_category: 'engagement',
        event_label: formName,
        custom_parameters: {
          success,
          error_message: errorMessage
        }
      });
    }
  }, [formName]);

  const trackFieldInteraction = useCallback((fieldName, action = 'focus') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_field_interaction', {
        event_category: 'engagement',
        event_label: `${formName}_${fieldName}`,
        custom_parameters: {
          action,
          form_name: formName,
          field_name: fieldName
        }
      });
    }
  }, [formName]);

  return {
    trackFormStart,
    trackFormSubmit,
    trackFieldInteraction
  };
}