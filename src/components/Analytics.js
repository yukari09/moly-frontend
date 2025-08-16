'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Analytics 4 tracking
export function GoogleAnalytics({ GA_MEASUREMENT_ID }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [GA_MEASUREMENT_ID]);

  useEffect(() => {
    if (!window.gtag || !GA_MEASUREMENT_ID) return;

    const url = pathname + searchParams.toString();
    
    // Track page views
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}

// Analytics utility functions
export const analytics = {
  // Track prompt optimization events
  trackPromptOptimization: (data) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'prompt_optimization', {
        event_category: 'engagement',
        event_label: data.generatorType,
        custom_parameters: {
          platform: data.platform,
          mode: data.mode,
          prompt_length: data.originalPrompt?.length || 0,
          optimization_time: data.processingTime || 0,
          techniques_count: data.techniquesApplied?.length || 0,
        }
      });
    }
  },

  // Track conversion events
  trackConversion: (conversionType, data = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        event_category: 'conversion',
        event_label: conversionType,
        value: data.value || 1,
        custom_parameters: data
      });
    }
  },

  // Track user interactions
  trackInteraction: (action, category, label, value) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  },

  // Track errors
  trackError: (error, context = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || 'Unknown error',
        fatal: false,
        custom_parameters: {
          error_context: context.context || 'unknown',
          error_component: context.component || 'unknown',
          error_stack: error.stack?.substring(0, 500) || 'no stack',
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  // Track performance metrics
  trackPerformance: (metric, value, context = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: metric,
        value: Math.round(value),
        event_category: 'performance',
        custom_parameters: context
      });
    }
  },

  // Track API response times
  trackApiResponse: (endpoint, responseTime, status, error = null) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'api_response', {
        event_category: 'api',
        event_label: endpoint,
        value: Math.round(responseTime),
        custom_parameters: {
          status_code: status,
          endpoint: endpoint,
          response_time: responseTime,
          has_error: !!error,
          error_message: error?.message || null,
          timestamp: new Date().toISOString()
        }
      });
    }
  }
};