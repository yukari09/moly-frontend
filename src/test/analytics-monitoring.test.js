import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { performanceMonitor, errorMonitor, conversionTracking } from '@/lib/monitoring';
import { analytics } from '@/components/Analytics';

// Mock window.gtag
const mockGtag = vi.fn();
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true
});

// Mock performance.now
const mockPerformanceNow = vi.fn();
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true
});

describe('Analytics and Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformanceNow.mockReturnValue(1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Performance Monitor', () => {
    it('should track timing metrics', () => {
      mockPerformanceNow
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1500); // end time

      performanceMonitor.startTiming('test_metric');
      const duration = performanceMonitor.endTiming('test_metric');

      expect(duration).toBe(500);
      expect(mockGtag).toHaveBeenCalledWith('event', 'timing_complete', {
        name: 'test_metric',
        value: 500,
        event_category: 'performance',
        custom_parameters: {}
      });
    });

    it('should monitor API calls', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1200); // end time

      const mockApiCall = vi.fn().mockResolvedValue({ status: 'success' });
      
      const result = await performanceMonitor.monitorApiCall('/test-endpoint', mockApiCall);

      expect(result).toEqual({ status: 'success' });
      expect(mockGtag).toHaveBeenCalledWith('event', 'api_response', {
        event_category: 'api',
        event_label: '/test-endpoint',
        value: 200,
        custom_parameters: {
          status_code: 'success',
          endpoint: '/test-endpoint',
          response_time: 200,
          has_error: false,
          error_message: null,
          timestamp: expect.any(String)
        }
      });
    });

    it('should handle API call errors', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1300); // end time

      const testError = new Error('API Error');
      const mockApiCall = vi.fn().mockRejectedValue(testError);
      
      await expect(
        performanceMonitor.monitorApiCall('/test-endpoint', mockApiCall)
      ).rejects.toThrow('API Error');

      expect(mockGtag).toHaveBeenCalledWith('event', 'api_response', {
        event_category: 'api',
        event_label: '/test-endpoint',
        value: 300,
        custom_parameters: {
          status_code: 'error',
          endpoint: '/test-endpoint',
          response_time: 300,
          has_error: true,
          error_message: 'API Error',
          timestamp: expect.any(String)
        }
      });
    });

    it('should provide metrics summary', () => {
      // Clear existing metrics first
      performanceMonitor.apiMetrics.clear();
      
      // Add some mock metrics
      performanceMonitor.apiMetrics.set('test1', {
        endpoint: '/api/test',
        responseTime: 100,
        status: 'success',
        error: null,
        timestamp: new Date().toISOString(),
        context: {}
      });

      performanceMonitor.apiMetrics.set('test2', {
        endpoint: '/api/test',
        responseTime: 200,
        status: 'error',
        error: 'Test error',
        timestamp: new Date().toISOString(),
        context: {}
      });

      const summary = performanceMonitor.getMetricsSummary();

      expect(summary.totalApiCalls).toBe(2);
      expect(summary.averageResponseTime).toBe(150);
      expect(summary.errorRate).toBe(0.5);
    });
  });

  describe('Error Monitor', () => {
    it('should log errors with context', () => {
      const testError = new Error('Test error');
      const context = {
        component: 'TestComponent',
        action: 'test_action'
      };

      const errorInfo = errorMonitor.logError(testError, context);

      expect(errorInfo.message).toBe('Test error');
      expect(errorInfo.context.component).toBe('TestComponent');
      expect(errorInfo.context.action).toBe('test_action');
      expect(errorInfo.timestamp).toBeDefined();

      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Test error',
        fatal: false,
        custom_parameters: expect.objectContaining({
          error_context: 'unknown',
          error_component: 'TestComponent',
          error_stack: expect.any(String),
          user_agent: expect.any(String),
          timestamp: expect.any(String)
        })
      });
    });

    it('should provide error statistics', () => {
      // Clear existing errors
      errorMonitor.errors = [];

      // Add test errors
      errorMonitor.logError(new Error('Error 1'), { component: 'Component1' });
      errorMonitor.logError(new Error('Error 2'), { component: 'Component1' });
      errorMonitor.logError(new Error('Error 1'), { component: 'Component2' });

      const stats = errorMonitor.getErrorStats();

      expect(stats.totalErrors).toBe(3);
      expect(stats.mostCommonError.message).toBe('Error 1');
      expect(stats.mostCommonError.count).toBe(2);
      expect(stats.errorsByComponent.Component1).toBe(2);
      expect(stats.errorsByComponent.Component2).toBe(1);
    });

    it('should limit stored errors', () => {
      // Clear existing errors
      errorMonitor.errors = [];
      errorMonitor.maxErrors = 3;

      // Add more errors than the limit
      for (let i = 0; i < 5; i++) {
        errorMonitor.logError(new Error(`Error ${i}`), {});
      }

      expect(errorMonitor.errors.length).toBe(3);
      expect(errorMonitor.errors[0].message).toBe('Error 4'); // Most recent first
    });
  });

  describe('Analytics Functions', () => {
    it('should track prompt optimization', () => {
      const data = {
        generatorType: 'writing',
        platform: 'chatgpt',
        mode: 'BASIC',
        originalPrompt: 'Test prompt',
        processingTime: 1500,
        techniquesApplied: ['role-assignment', 'context-layering']
      };

      analytics.trackPromptOptimization(data);

      expect(mockGtag).toHaveBeenCalledWith('event', 'prompt_optimization', {
        event_category: 'engagement',
        event_label: 'writing',
        custom_parameters: {
          platform: 'chatgpt',
          mode: 'BASIC',
          prompt_length: 11,
          optimization_time: 1500,
          techniques_count: 2
        }
      });
    });

    it('should track conversions', () => {
      analytics.trackConversion('prompt_copy', { generator_type: 'art' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'conversion', {
        event_category: 'conversion',
        event_label: 'prompt_copy',
        value: 1,
        custom_parameters: { generator_type: 'art' }
      });
    });

    it('should track user interactions', () => {
      analytics.trackInteraction('button_click', 'engagement', 'optimize_button', 1);

      expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', {
        event_category: 'engagement',
        event_label: 'optimize_button',
        value: 1
      });
    });

    it('should track errors', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent' };

      analytics.trackError(error, context);

      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Test error',
        fatal: false,
        custom_parameters: expect.objectContaining({
          error_context: 'unknown',
          error_component: 'TestComponent',
          error_stack: expect.any(String),
          user_agent: expect.any(String),
          timestamp: expect.any(String)
        })
      });
    });
  });

  describe('Conversion Tracking', () => {
    it('should track generator start', () => {
      conversionTracking.trackGeneratorStart('writing', 'chatgpt');

      expect(mockGtag).toHaveBeenCalledWith('event', 'generator_start', {
        event_category: 'engagement',
        event_label: 'writing',
        value: 1
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'conversion', {
        event_category: 'conversion',
        event_label: 'generator_usage',
        value: 1,
        custom_parameters: {
          generator_type: 'writing',
          platform: 'chatgpt',
          step: 'start'
        }
      });
    });

    it('should track optimization success', () => {
      const data = {
        generatorType: 'art',
        platform: 'midjourney',
        mode: 'DETAIL',
        processingTime: 2000
      };

      conversionTracking.trackOptimizationSuccess(data);

      expect(mockGtag).toHaveBeenCalledWith('event', 'prompt_optimization', {
        event_category: 'engagement',
        event_label: 'art',
        custom_parameters: {
          platform: 'midjourney',
          mode: 'DETAIL',
          prompt_length: 0,
          optimization_time: 2000,
          techniques_count: 0
        }
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'conversion', {
        event_category: 'conversion',
        event_label: 'prompt_optimization',
        value: 1,
        custom_parameters: {
          generator_type: 'art',
          platform: 'midjourney',
          mode: 'DETAIL',
          success: true,
          processing_time: 2000
        }
      });
    });

    it('should track prompt copy', () => {
      conversionTracking.trackPromptCopy('chatgpt', 'chatgpt');

      expect(mockGtag).toHaveBeenCalledWith('event', 'prompt_copy', {
        event_category: 'engagement',
        event_label: 'chatgpt',
        value: 1
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'conversion', {
        event_category: 'conversion',
        event_label: 'prompt_copy',
        value: 1,
        custom_parameters: {
          generator_type: 'chatgpt',
          platform: 'chatgpt'
        }
      });
    });
  });
});

describe('Analytics Integration', () => {
  it('should handle missing gtag gracefully', () => {
    // Temporarily set gtag to undefined
    const originalGtag = window.gtag;
    window.gtag = undefined;

    expect(() => {
      analytics.trackInteraction('test', 'test', 'test', 1);
    }).not.toThrow();

    expect(() => {
      analytics.trackError(new Error('test'));
    }).not.toThrow();

    // Restore gtag
    window.gtag = originalGtag;
  });

  it('should handle server-side rendering', () => {
    // Mock server environment
    const originalWindow = global.window;
    delete global.window;

    expect(() => {
      analytics.trackInteraction('test', 'test', 'test', 1);
    }).not.toThrow();

    // Restore window
    global.window = originalWindow;
  });
});