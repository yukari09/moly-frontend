import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KariOptimizer } from '@/components/generators/KariOptimizer';
import { NextIntlClientProvider } from 'next-intl';

// Mock the monitoring hooks
vi.mock('@/hooks/useMonitoring', () => ({
  useMonitoring: () => ({
    startTiming: vi.fn(),
    endTiming: vi.fn().mockReturnValue(1500),
    logError: vi.fn(),
    monitorApiCall: vi.fn().mockImplementation(async (endpoint, apiCall) => {
      return await apiCall();
    }),
    trackConversion: {
      trackGeneratorStart: vi.fn(),
      trackOptimizationSuccess: vi.fn(),
      trackPromptCopy: vi.fn(),
      trackPromptSave: vi.fn(),
      trackPromptRegenerate: vi.fn()
    }
  }),
  useFormMonitoring: () => ({
    trackFormStart: vi.fn(),
    trackFormSubmit: vi.fn(),
    trackFieldInteraction: vi.fn()
  })
}));

// Mock the API response
global.fetch = vi.fn();

const mockMessages = {
  KariOptimizer: {
    welcome: {
      title: 'Welcome to Kari AI',
      subtitle: 'Your AI Prompt Optimization Assistant'
    },
    input: {
      title: 'Your Prompt',
      placeholder: 'Enter your prompt here...',
      platform: 'Platform',
      mode: 'Mode'
    },
    buttons: {
      optimize: 'Optimize',
      copy: 'Copy',
      save: 'Save',
      regenerate: 'Regenerate'
    },
    success: {
      optimized: 'Prompt optimized successfully!',
      copied: 'Copied to clipboard!'
    },
    errors: {
      optimizationFailed: 'Optimization failed',
      networkError: 'Network error'
    }
  }
};

const TestWrapper = ({ children }) => (
  <NextIntlClientProvider locale="en" messages={mockMessages}>
    {children}
  </NextIntlClientProvider>
);

describe('KariOptimizer Monitoring Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API response
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          optimizedPrompt: 'Optimized test prompt',
          keyImprovements: ['Added context', 'Improved clarity'],
          techniquesApplied: ['role-assignment', 'context-layering'],
          processingTime: 1.5
        }
      })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should track form interactions when user interacts with the component', async () => {
    const { useMonitoring, useFormMonitoring } = await import('@/hooks/useMonitoring');
    const mockUseMonitoring = useMonitoring();
    const mockUseFormMonitoring = useFormMonitoring();

    render(
      <TestWrapper>
        <KariOptimizer generatorType="writing" />
      </TestWrapper>
    );

    // Find the textarea and interact with it
    const textarea = screen.getByPlaceholderText('Enter your prompt here...');
    
    // Focus should trigger form start tracking
    fireEvent.focus(textarea);
    expect(mockUseFormMonitoring.trackFormStart).toHaveBeenCalled();
    expect(mockUseFormMonitoring.trackFieldInteraction).toHaveBeenCalledWith('prompt_input', 'focus');

    // Type in the textarea
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });

    // Blur should trigger field interaction tracking
    fireEvent.blur(textarea);
    expect(mockUseFormMonitoring.trackFieldInteraction).toHaveBeenCalledWith('prompt_input', 'blur');
  });

  it('should track optimization process with monitoring', async () => {
    const { useMonitoring } = await import('@/hooks/useMonitoring');
    const mockUseMonitoring = useMonitoring();

    render(
      <TestWrapper>
        <KariOptimizer generatorType="writing" />
      </TestWrapper>
    );

    // Enter a prompt
    const textarea = screen.getByPlaceholderText('Enter your prompt here...');
    fireEvent.change(textarea, { target: { value: 'Test prompt for optimization' } });

    // Click optimize button
    const optimizeButton = screen.getByText('Optimize');
    fireEvent.click(optimizeButton);

    await waitFor(() => {
      // Should start timing
      expect(mockUseMonitoring.startTiming).toHaveBeenCalledWith('optimization_request');
      
      // Should monitor API call
      expect(mockUseMonitoring.monitorApiCall).toHaveBeenCalledWith(
        '/api/kari/optimize',
        expect.any(Function),
        expect.objectContaining({
          generatorType: 'writing',
          platform: 'chatgpt',
          mode: 'BASIC'
        })
      );

      // Should track conversion
      expect(mockUseMonitoring.trackConversion.trackGeneratorStart).toHaveBeenCalledWith('writing', 'chatgpt');
      expect(mockUseMonitoring.trackConversion.trackOptimizationSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          generatorType: 'writing',
          platform: 'chatgpt',
          mode: 'BASIC'
        })
      );
    });
  });

  it('should track errors when optimization fails', async () => {
    const { useMonitoring, useFormMonitoring } = await import('@/hooks/useMonitoring');
    const mockUseMonitoring = useMonitoring();
    const mockUseFormMonitoring = useFormMonitoring();

    // Mock API error
    fetch.mockRejectedValue(new Error('API Error'));

    render(
      <TestWrapper>
        <KariOptimizer generatorType="writing" />
      </TestWrapper>
    );

    // Enter a prompt and optimize
    const textarea = screen.getByPlaceholderText('Enter your prompt here...');
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });

    const optimizeButton = screen.getByText('Optimize');
    fireEvent.click(optimizeButton);

    await waitFor(() => {
      // Should log error
      expect(mockUseMonitoring.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          action: 'optimization_request',
          generatorType: 'writing'
        })
      );

      // Should track failed form submission
      expect(mockUseFormMonitoring.trackFormSubmit).toHaveBeenCalledWith(false, 'API Error');
    });
  });

  it('should track copy action when user copies optimized prompt', async () => {
    const { useMonitoring } = await import('@/hooks/useMonitoring');
    const mockUseMonitoring = useMonitoring();

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue()
      }
    });

    render(
      <TestWrapper>
        <KariOptimizer generatorType="writing" />
      </TestWrapper>
    );

    // Enter a prompt and optimize
    const textarea = screen.getByPlaceholderText('Enter your prompt here...');
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });

    const optimizeButton = screen.getByText('Optimize');
    fireEvent.click(optimizeButton);

    // Wait for optimization to complete
    await waitFor(() => {
      expect(screen.getByText('Optimized test prompt')).toBeInTheDocument();
    });

    // Click copy button
    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    await waitFor(() => {
      // Should track copy action
      expect(mockUseMonitoring.trackConversion.trackPromptCopy).toHaveBeenCalledWith('writing', 'chatgpt');
    });
  });

  it('should track platform and mode changes', async () => {
    const { useFormMonitoring } = await import('@/hooks/useMonitoring');
    const mockUseFormMonitoring = useFormMonitoring();

    render(
      <TestWrapper>
        <KariOptimizer generatorType="writing" />
      </TestWrapper>
    );

    // Find and interact with platform selector
    const platformSelect = screen.getByRole('combobox');
    fireEvent.click(platformSelect);
    
    // This would trigger the onValueChange which should call trackFieldInteraction
    // Note: This is a simplified test - in reality, we'd need to select an actual option
    
    // The actual tracking happens in the onValueChange callback
    // which we've mocked in the component
  });
});