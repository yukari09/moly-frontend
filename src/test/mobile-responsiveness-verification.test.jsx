/**
 * Mobile Responsiveness Verification Test
 * Tests the implemented mobile improvements
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';

// Mock messages for testing
const mockMessages = {
  KariOptimizer: {
    welcome: {
      title: 'Welcome to Kari AI',
      message: 'Optimize your prompts with AI',
      basicMode: 'Quick optimization',
      detailMode: 'Detailed optimization'
    },
    input: {
      title: 'Input',
      placeholder: 'Enter your prompt...',
      platform: 'Platform',
      mode: 'Mode',
      optimize: 'Optimize',
      optimizing: 'Optimizing...'
    },
    result: {
      optimizedPrompt: 'Optimized Prompt',
      copy: 'Copy',
      save: 'Save',
      share: 'Share',
      regenerate: 'Regenerate',
      newPrompt: 'New Prompt',
      improvements: 'Key Improvements',
      techniques: 'Techniques Applied',
      proTip: 'Pro Tip'
    },
    errors: {
      emptyPrompt: 'Please enter a prompt',
      promptTooShort: 'Prompt too short',
      promptTooLong: 'Prompt too long',
      optimizationFailed: 'Optimization failed',
      networkError: 'Network error'
    },
    success: {
      optimized: 'Prompt optimized',
      copied: 'Copied to clipboard',
      saved: 'Result saved',
      shared: 'Shared successfully'
    },
    saved: {
      title: 'Saved Results',
      empty: 'No saved results',
      load: 'Load',
      delete: 'Delete'
    }
  }
};

// Test wrapper component
const TestWrapper = ({ children, locale = 'en' }) => (
  <NextIntlClientProvider locale={locale} messages={mockMessages}>
    {children}
  </NextIntlClientProvider>
);

// Mock viewport sizes for mobile testing
const mockViewport = (width, height) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('Mobile Responsiveness Verification', () => {
  beforeEach(() => {
    // Reset viewport to mobile size
    mockViewport(375, 667); // iPhone SE size
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
  });

  describe('Touch Target Improvements', () => {
    test('all buttons meet minimum touch target size', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const optimizeButton = screen.getByRole('button', { name: /optimize/i });
      
      // Check if button has proper mobile classes
      expect(optimizeButton).toHaveClass('min-h-[44px]');
    });

    test('form inputs have proper mobile sizing', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Enter your prompt...');
      const platformSelect = screen.getByRole('combobox');
      
      // Check if inputs have proper mobile classes
      expect(textarea).toHaveClass('text-base');
      expect(platformSelect).toHaveClass('min-h-[44px]');
    });

    test('tabs have adequate touch targets', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const basicTab = screen.getByRole('tab', { name: 'BASIC' });
      const detailTab = screen.getByRole('tab', { name: 'DETAIL' });
      
      // Check if tabs have proper mobile classes
      expect(basicTab).toHaveClass('min-h-[40px]');
      expect(detailTab).toHaveClass('min-h-[40px]');
    });
  });

  describe('Accessibility Improvements', () => {
    test('form elements have proper labels', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Check for proper label associations
      const platformSelect = screen.getByRole('combobox');
      const textarea = screen.getByPlaceholderText('Enter your prompt...');
      
      expect(platformSelect).toHaveAttribute('id', 'platform-select');
      expect(textarea).toHaveAttribute('id', 'prompt-input');
      expect(textarea).toHaveAttribute('aria-label', 'Enter your prompt...');
    });

    test('buttons have proper aria labels', () => {
      // Mock saved results in localStorage
      const mockSavedResults = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          originalPrompt: 'Original prompt',
          optimizedPrompt: 'Optimized prompt',
          platform: 'chatgpt',
          mode: 'BASIC',
          generatorType: 'writing'
        }
      ];
      
      window.localStorage.getItem.mockReturnValue(JSON.stringify(mockSavedResults));

      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const savedButton = screen.getByLabelText('Show saved results');
      expect(savedButton).toBeInTheDocument();
    });
  });

  describe('Mobile Layout Improvements', () => {
    test('result buttons adapt to mobile layout', async () => {
      // Mock successful API response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            optimizedPrompt: 'This is an optimized prompt for mobile testing',
            keyImprovements: ['Better clarity', 'More specific'],
            techniquesApplied: ['Role assignment', 'Context layering'],
            proTip: 'Use specific examples for better results'
          }
        })
      });

      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Fill in prompt and submit
      const textarea = screen.getByPlaceholderText('Enter your prompt...');
      const optimizeButton = screen.getByRole('button', { name: /optimize/i });
      
      fireEvent.change(textarea, { target: { value: 'Test prompt for optimization' } });
      fireEvent.click(optimizeButton);

      // Wait for result to appear
      await waitFor(() => {
        expect(screen.getByText('Optimized Prompt')).toBeInTheDocument();
      });

      // Check if action buttons have mobile-friendly classes
      const copyButton = screen.getByRole('button', { name: /copy/i });
      const saveButton = screen.getByRole('button', { name: /save/i });
      
      expect(copyButton).toHaveClass('min-h-[44px]');
      expect(saveButton).toHaveClass('min-h-[44px]');
    });

    test('mobile text sizing is applied correctly', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Enter your prompt...');
      
      // Check if textarea has mobile-friendly text sizing
      expect(textarea).toHaveClass('text-base');
    });
  });

  describe('Tablet Responsiveness', () => {
    beforeEach(() => {
      // Set tablet viewport
      mockViewport(768, 1024); // iPad size
    });

    test('layout adapts properly to tablet size', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Check if component renders without issues on tablet
      expect(screen.getByText('Welcome to Kari AI')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
      expect(screen.getByText('Mode')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    test('all interactive elements are keyboard accessible', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Enter your prompt...');
      const optimizeButton = screen.getByRole('button', { name: /optimize/i });
      
      // Test tab navigation
      textarea.focus();
      expect(document.activeElement).toBe(textarea);
      
      // Test that button can receive focus (button is disabled initially)
      // Fill textarea first to enable the button
      fireEvent.change(textarea, { target: { value: 'Test prompt to enable button' } });
      
      optimizeButton.focus();
      expect(document.activeElement).toBe(optimizeButton);
    });
  });

  describe('Performance on Mobile', () => {
    test('component renders quickly on mobile viewport', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within reasonable time (less than 100ms)
      expect(renderTime).toBeLessThan(100);
      
      // Check that essential elements are present
      expect(screen.getByText('Welcome to Kari AI')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your prompt...')).toBeInTheDocument();
    });
  });
});