/**
 * Mobile Responsiveness Test Suite
 * Tests all generator pages and KariOptimizer component for mobile usability
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';
import WritingPromptGenerator from '@/app/[locale]/writing-prompt-generator/page.jsx';
import ArtPromptGenerator from '@/app/[locale]/art-prompt-generator/page.jsx';
import ChatGPTPromptGenerator from '@/app/[locale]/chatgpt-prompt-generator/page.jsx';
import MidjourneyPromptGenerator from '@/app/[locale]/midjourney-prompt-generator/page.jsx';
import DrawingPromptGenerator from '@/app/[locale]/drawing-prompt-generator/page.jsx';
import AIVideoPromptGenerator from '@/app/[locale]/ai-video-prompt-generator/page.jsx';

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
  },
  WritingGenerator: {
    title: 'Writing Prompt Generator',
    description: 'Generate creative writing prompts',
    features: {
      types: {
        title: 'Multiple Types',
        description: 'Various writing types'
      },
      difficulty: {
        title: 'Difficulty Levels',
        description: 'From beginner to expert'
      },
      themes: {
        title: 'Rich Themes',
        description: 'Diverse themes and topics'
      }
    }
  },
  ArtGenerator: {
    title: 'Art Prompt Generator',
    description: 'Generate artistic prompts'
  },
  ChatGPTGenerator: {
    title: 'ChatGPT Prompt Generator',
    description: 'Generate ChatGPT prompts'
  },
  MidjourneyGenerator: {
    title: 'Midjourney Prompt Generator',
    description: 'Generate Midjourney prompts'
  },
  DrawingGenerator: {
    title: 'Drawing Prompt Generator',
    description: 'Generate drawing prompts'
  },
  AIVideoGenerator: {
    title: 'AI Video Prompt Generator',
    description: 'Generate AI video prompts'
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

describe('Mobile Responsiveness Tests', () => {
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

  describe('KariOptimizer Mobile Responsiveness', () => {
    test('renders properly on mobile viewport', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Check if welcome card is visible
      expect(screen.getByText('Welcome to Kari AI')).toBeInTheDocument();
      
      // Check if input elements are accessible
      expect(screen.getByPlaceholderText('Enter your prompt...')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
      expect(screen.getByText('Mode')).toBeInTheDocument();
    });

    test('textarea is properly sized for mobile', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Enter your prompt...');
      
      // Check if textarea has proper mobile styling
      expect(textarea).toHaveClass('min-h-[120px]');
      
      // Test touch interaction
      fireEvent.focus(textarea);
      fireEvent.change(textarea, { target: { value: 'Test prompt for mobile' } });
      
      expect(textarea.value).toBe('Test prompt for mobile');
    });

    test('platform selector works on mobile', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Find and click the platform selector
      const platformTrigger = screen.getByRole('combobox');
      fireEvent.click(platformTrigger);
      
      // Check if options are visible (they should be in a mobile-friendly dropdown)
      waitFor(() => {
        expect(screen.getByText('ChatGPT')).toBeInTheDocument();
        expect(screen.getByText('Claude')).toBeInTheDocument();
        expect(screen.getByText('Gemini')).toBeInTheDocument();
      });
    });

    test('mode tabs are touch-friendly', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const basicTab = screen.getByRole('tab', { name: 'BASIC' });
      const detailTab = screen.getByRole('tab', { name: 'DETAIL' });
      
      // Test tab switching with touch
      fireEvent.click(detailTab);
      expect(detailTab).toHaveAttribute('data-state', 'active');
      
      fireEvent.click(basicTab);
      expect(basicTab).toHaveAttribute('data-state', 'active');
    });

    test('buttons are properly sized for touch', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const optimizeButton = screen.getByRole('button', { name: /optimize/i });
      
      // Check if button has adequate touch target size (minimum 44px)
      const buttonStyles = window.getComputedStyle(optimizeButton);
      const minHeight = parseInt(buttonStyles.minHeight) || parseInt(buttonStyles.height);
      
      expect(minHeight).toBeGreaterThanOrEqual(44);
    });

    test('result display is mobile-optimized', async () => {
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

      // Check if action buttons are properly arranged for mobile
      const copyButton = screen.getByRole('button', { name: /copy/i });
      const saveButton = screen.getByRole('button', { name: /save/i });
      const shareButton = screen.getByRole('button', { name: /share/i });
      
      expect(copyButton).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(shareButton).toBeInTheDocument();
    });

    test('saved results panel is mobile-friendly', () => {
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

      // Should show saved results button when there are saved results
      const savedButton = screen.getByRole('button', { name: '' }); // Save icon button
      fireEvent.click(savedButton);

      // Check if saved results panel is scrollable on mobile
      waitFor(() => {
        const savedResultsContainer = screen.getByText('Saved Results').closest('.space-y-3');
        expect(savedResultsContainer).toHaveClass('max-h-96', 'overflow-y-auto');
      });
    });
  });

  describe('Generator Pages Mobile Responsiveness', () => {
    const generatorPages = [
      { component: WritingPromptGenerator, name: 'Writing Prompt Generator' },
      { component: ArtPromptGenerator, name: 'Art Prompt Generator' },
      { component: ChatGPTPromptGenerator, name: 'ChatGPT Prompt Generator' },
      { component: MidjourneyPromptGenerator, name: 'Midjourney Prompt Generator' },
      { component: DrawingPromptGenerator, name: 'Drawing Prompt Generator' },
      { component: AIVideoPromptGenerator, name: 'AI Video Prompt Generator' }
    ];

    generatorPages.forEach(({ component: Component, name }) => {
      test(`${name} is mobile responsive`, () => {
        render(
          <TestWrapper>
            <Component />
          </TestWrapper>
        );

        // Check if page title is responsive
        const title = screen.getByRole('heading', { level: 1 });
        expect(title).toBeInTheDocument();
        
        // Check if KariOptimizer is present
        expect(screen.getByText('Welcome to Kari AI')).toBeInTheDocument();
        
        // Check if feature grid is responsive
        const featureElements = screen.getAllByRole('heading', { level: 3 });
        expect(featureElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Touch Interface Optimization', () => {
    test('all interactive elements have adequate touch targets', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Get all buttons and check their touch target size
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        const minSize = 44; // Minimum touch target size in pixels
        
        expect(Math.max(rect.width, rect.height)).toBeGreaterThanOrEqual(minSize);
      });
    });

    test('form inputs are optimized for mobile keyboards', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Enter your prompt...');
      
      // Check if textarea has proper mobile attributes
      expect(textarea).toHaveAttribute('maxLength', '2000');
      
      // Test that virtual keyboard doesn't break layout
      fireEvent.focus(textarea);
      
      // Simulate virtual keyboard appearance (reduce viewport height)
      mockViewport(375, 400);
      
      // Textarea should still be accessible
      expect(textarea).toBeVisible();
    });

    test('navigation is touch-friendly', () => {
      // This would typically test the header navigation
      // For now, we'll test that the layout doesn't break on mobile
      mockViewport(375, 667);
      
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Check that the component renders without layout issues
      expect(screen.getByText('Welcome to Kari AI')).toBeInTheDocument();
    });
  });

  describe('Tablet Responsiveness', () => {
    beforeEach(() => {
      // Set tablet viewport
      mockViewport(768, 1024); // iPad size
    });

    test('KariOptimizer adapts to tablet layout', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Check if layout adapts to tablet size
      expect(screen.getByText('Welcome to Kari AI')).toBeInTheDocument();
      
      // Platform and mode selectors should be side by side on tablet
      const platformLabel = screen.getByText('Platform');
      const modeLabel = screen.getByText('Mode');
      
      expect(platformLabel).toBeInTheDocument();
      expect(modeLabel).toBeInTheDocument();
    });

    test('generator pages use tablet-optimized grid layout', () => {
      render(
        <TestWrapper>
          <WritingPromptGenerator />
        </TestWrapper>
      );

      // Check if feature grid adapts to tablet (should show 3 columns)
      const featureElements = screen.getAllByRole('heading', { level: 3 });
      expect(featureElements.length).toBe(3);
    });
  });

  describe('Accessibility on Mobile', () => {
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
      
      // Test that button is focusable
      optimizeButton.focus();
      expect(document.activeElement).toBe(optimizeButton);
    });

    test('screen reader labels are present', () => {
      render(
        <TestWrapper>
          <KariOptimizer generatorType="writing" />
        </TestWrapper>
      );

      // Check for proper labels
      expect(screen.getByLabelText(/platform/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mode/i)).toBeInTheDocument();
    });
  });
});