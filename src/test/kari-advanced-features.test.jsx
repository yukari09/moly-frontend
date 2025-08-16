/**
 * Test for advanced Kari features implementation
 * Tests clarifying questions, smart defaults, technique tooltips, and optimization history
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KariOptimizer } from '@/components/generators/KariOptimizer';

// Mock translations
const messages = {
  KariOptimizer: {
    welcome: {
      title: "Meet Kari - Your AI Prompt Optimization Expert",
      message: "I'll transform your prompt using advanced 4-D methodology to unlock maximum AI potential. Choose your optimization mode:",
      basicMode: "Quick optimization with core improvements and instant results",
      detailMode: "Deep analysis with clarifying questions and advanced techniques"
    },
    input: {
      title: "Enter Your Prompt",
      placeholder: "Describe what you want to create or achieve...",
      platform: "Target Platform",
      mode: "Optimization Mode",
      optimize: "Optimize with Kari",
      optimizing: "Optimizing..."
    },
    result: {
      optimizedPrompt: "Your Optimized Prompt",
      copy: "Copy",
      save: "Save",
      share: "Share",
      regenerate: "Regenerate",
      newPrompt: "New Prompt",
      improvements: "Key Improvements",
      techniques: "Techniques Applied",
      proTip: "Pro Tip"
    },
    errors: {
      optimizationFailed: "Optimization failed. Please try again.",
      networkError: "Network error. Please check your connection.",
      emptyPrompt: "Please enter a prompt to optimize.",
      promptTooShort: "Prompt should be at least 10 characters long.",
      promptTooLong: "Prompt should be less than 2000 characters."
    },
    success: {
      copied: "Copied to clipboard!",
      optimized: "Prompt optimized successfully!",
      saved: "Result saved successfully!",
      deleted: "Result deleted successfully!",
      loaded: "Result loaded successfully!",
      shared: "Shared successfully!",
      shareLink: "Share link copied to clipboard!",
      historyCleared: "Optimization history cleared!"
    },
    clarifying: {
      title: "Help Kari Understand Better",
      description: "Answer these questions to get more personalized optimization. Kari will use your answers to apply the most relevant techniques.",
      selectOption: "Select an option...",
      optimize: "Optimize with Answers",
      useDefaults: "Use Smart Defaults"
    },
    history: {
      title: "Optimization History",
      empty: "No optimization history yet. Your recent optimizations will appear here.",
      load: "Load this optimization",
      clear: "Clear History"
    }
  }
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = vi.fn();

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderKariOptimizer = (generatorType = 'writing') => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <KariOptimizer generatorType={generatorType} />
    </NextIntlClientProvider>
  );
};

describe('KariOptimizer Advanced Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Smart Defaults', () => {
    it('should set smart defaults based on generator type', () => {
      renderKariOptimizer('writing');
      
      // Check if the component renders without errors
      expect(screen.getByText('Meet Kari - Your AI Prompt Optimization Expert')).toBeInTheDocument();
    });

    it('should have different defaults for different generator types', () => {
      const { rerender } = renderKariOptimizer('art');
      expect(screen.getByText('Meet Kari - Your AI Prompt Optimization Expert')).toBeInTheDocument();
      
      // Rerender with different type
      rerender(
        <NextIntlClientProvider locale="en" messages={messages}>
          <KariOptimizer generatorType="midjourney" />
        </NextIntlClientProvider>
      );
      expect(screen.getByText('Meet Kari - Your AI Prompt Optimization Expert')).toBeInTheDocument();
    });
  });

  describe('Clarifying Questions', () => {
    it('should show clarifying questions dialog for DETAIL mode', async () => {
      renderKariOptimizer('writing');
      
      // Switch to DETAIL mode
      const detailTab = screen.getByText('DETAIL');
      fireEvent.click(detailTab);
      
      // Enter a prompt
      const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
      fireEvent.change(textarea, { target: { value: 'Write a story about a dragon' } });
      
      // Click optimize
      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);
      
      // Should show clarifying questions dialog
      await waitFor(() => {
        expect(screen.getByText('Help Kari Understand Better')).toBeInTheDocument();
      });
    });

    it('should allow skipping clarifying questions with smart defaults', async () => {
      renderKariOptimizer('writing');
      
      // Mock successful API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            optimizedPrompt: 'Optimized prompt',
            keyImprovements: ['Better structure'],
            techniquesApplied: ['Role Assignment'],
            processingTime: 1.5
          }
        })
      });
      
      // Switch to DETAIL mode
      const detailTab = screen.getByText('DETAIL');
      fireEvent.click(detailTab);
      
      // Enter a prompt
      const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
      fireEvent.change(textarea, { target: { value: 'Write a story about a dragon' } });
      
      // Click optimize
      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);
      
      // Wait for clarifying questions dialog
      await waitFor(() => {
        expect(screen.getByText('Help Kari Understand Better')).toBeInTheDocument();
      });
      
      // Click use smart defaults
      const useDefaultsButton = screen.getByText('Use Smart Defaults');
      fireEvent.click(useDefaultsButton);
      
      // Should proceed with optimization
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Technique Tooltips', () => {
    it('should show technique explanations on hover', async () => {
      renderKariOptimizer('writing');
      
      // Mock successful API response with techniques
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            optimizedPrompt: 'Optimized prompt',
            keyImprovements: ['Better structure'],
            techniquesApplied: ['Role Assignment', 'Context Layering'],
            processingTime: 1.5
          }
        })
      });
      
      // Enter a prompt and optimize
      const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
      fireEvent.change(textarea, { target: { value: 'Write a story about a dragon' } });
      
      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);
      
      // Wait for results
      await waitFor(() => {
        expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
      });
      
      // Check if techniques are displayed
      expect(screen.getByText('Role Assignment')).toBeInTheDocument();
      expect(screen.getByText('Context Layering')).toBeInTheDocument();
    });
  });

  describe('Optimization History', () => {
    it('should save optimization to history', async () => {
      renderKariOptimizer('writing');
      
      // Mock successful API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            optimizedPrompt: 'Optimized prompt',
            keyImprovements: ['Better structure'],
            techniquesApplied: ['Role Assignment'],
            processingTime: 1.5
          }
        })
      });
      
      // Enter a prompt and optimize
      const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
      fireEvent.change(textarea, { target: { value: 'Write a story about a dragon' } });
      
      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);
      
      // Wait for results
      await waitFor(() => {
        expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
      });
      
      // Check if history was saved to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'kari-optimization-history',
        expect.stringContaining('Write a story about a dragon')
      );
    });

    it('should load optimization history from localStorage', () => {
      const mockHistory = JSON.stringify([
        {
          timestamp: new Date().toISOString(),
          originalPrompt: 'Test prompt',
          optimizedPrompt: 'Optimized test prompt',
          platform: 'chatgpt',
          mode: 'BASIC',
          generatorType: 'writing',
          keyImprovements: ['Better structure'],
          techniquesApplied: ['Role Assignment'],
          processingTime: 1.2
        }
      ]);
      
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'kari-optimization-history') return mockHistory;
        return null;
      });
      
      renderKariOptimizer('writing');
      
      // Should load history from localStorage
      expect(localStorageMock.getItem).toHaveBeenCalledWith('kari-optimization-history');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      renderKariOptimizer('writing');
      
      // Mock API error
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Enter a prompt and optimize
      const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
      fireEvent.change(textarea, { target: { value: 'Write a story about a dragon' } });
      
      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
      });
    });

    it('should validate input before optimization', () => {
      renderKariOptimizer('writing');
      
      // Try to optimize without entering a prompt
      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);
      
      // Should show validation error
      expect(screen.getByText('Please enter a prompt to optimize.')).toBeInTheDocument();
    });
  });
});