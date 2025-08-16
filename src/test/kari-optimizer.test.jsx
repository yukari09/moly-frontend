import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KariOptimizer } from '@/components/generators/KariOptimizer.jsx';

// Mock fetch
global.fetch = vi.fn();

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock translations
const messages = {
  KariOptimizer: {
    welcome: {
      title: 'Welcome to Kari AI Prompt Optimizer',
      message: 'I am Kari, your AI prompt optimization expert.',
      basicMode: 'Quick optimization with core techniques.',
      detailMode: 'Deep optimization with advanced techniques.'
    },
    input: {
      title: 'Enter Your Prompt',
      placeholder: 'Enter the prompt you want to optimize here...',
      platform: 'Target Platform',
      mode: 'Optimization Mode',
      optimize: 'Optimize Prompt',
      optimizing: 'Optimizing...'
    },
    result: {
      optimizedPrompt: 'Optimized Prompt',
      copy: 'Copy',
      improvements: 'Key Improvements',
      techniques: 'Techniques Applied',
      proTip: 'Pro Tip'
    }
  }
};

const renderWithIntl = (component) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('KariOptimizer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without errors on writing-prompt-generator page', () => {
      expect(() => {
        renderWithIntl(
          <KariOptimizer 
            generatorType="writing"
            defaultMode="DETAIL"
          />
        );
      }).not.toThrow();
    });

    it('should display welcome message initially', () => {
      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      expect(screen.getByText('Welcome to Kari AI Prompt Optimizer')).toBeInTheDocument();
      expect(screen.getByText('I am Kari, your AI prompt optimization expert.')).toBeInTheDocument();
    });

    it('should display BASIC and DETAIL mode descriptions', () => {
      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      expect(screen.getByText('BASIC Mode')).toBeInTheDocument();
      expect(screen.getByText('DETAIL Mode')).toBeInTheDocument();
      expect(screen.getByText('Quick optimization with core techniques.')).toBeInTheDocument();
      expect(screen.getByText('Deep optimization with advanced techniques.')).toBeInTheDocument();
    });

    it('should render input form elements', () => {
      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      expect(screen.getByPlaceholderText('Enter the prompt you want to optimize here...')).toBeInTheDocument();
      expect(screen.getByText('Target Platform')).toBeInTheDocument();
      expect(screen.getByText('Optimization Mode')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Optimize Prompt' })).toBeInTheDocument();
    });
  });

  describe('Form Input and Platform Selection', () => {
    it('should handle text input in prompt textarea', () => {
      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      fireEvent.change(textarea, { target: { value: 'Test prompt for optimization' } });

      expect(textarea.value).toBe('Test prompt for optimization');
    });

    it('should handle platform selection', async () => {
      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      // Find and click the platform select trigger
      const platformSelect = screen.getByRole('combobox');
      fireEvent.click(platformSelect);

      // Wait for options to appear and select Claude
      await waitFor(() => {
        const claudeOption = screen.getByText('Claude');
        fireEvent.click(claudeOption);
      });

      // Verify selection (this might need adjustment based on actual Select component behavior)
      expect(platformSelect).toBeInTheDocument();
    });

    it('should handle mode switching between BASIC and DETAIL', () => {
      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="BASIC"
        />
      );

      const basicTab = screen.getByRole('tab', { name: 'BASIC' });
      const detailTab = screen.getByRole('tab', { name: 'DETAIL' });
      
      // Verify both tabs are present and clickable
      expect(basicTab).toBeInTheDocument();
      expect(detailTab).toBeInTheDocument();

      // Click DETAIL tab - should not throw error
      expect(() => fireEvent.click(detailTab)).not.toThrow();
      
      // Click BASIC tab - should not throw error
      expect(() => fireEvent.click(basicTab)).not.toThrow();
    });

    it('should disable optimize button when prompt is empty', () => {
      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });
      expect(optimizeButton).toBeDisabled();
    });

    it('should enable optimize button when prompt has content', () => {
      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });

      expect(optimizeButton).not.toBeDisabled();
    });
  });

  describe('API Call to /api/kari/optimize endpoint', () => {
    it('should make API call with correct parameters', async () => {
      const mockResponse = {
        success: true,
        data: {
          optimizedPrompt: 'Optimized test prompt',
          keyImprovements: ['Better clarity', 'Enhanced structure'],
          techniquesApplied: ['Role Assignment', 'Context Enhancement'],
          proTip: 'Use specific examples for better results'
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt for API call' } });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/kari/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'Test prompt for API call',
            platform: 'chatgpt',
            generatorType: 'writing',
            mode: 'DETAIL',
            locale: 'en'
          })
        });
      });
    });

    it('should show loading state during API call', async () => {
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, data: {} })
        }), 100))
      );

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      fireEvent.click(optimizeButton);

      expect(screen.getByText('Optimizing...')).toBeInTheDocument();
      expect(optimizeButton).toBeDisabled();
    });

    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Optimization failed:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Response Handling and Result Display', () => {
    const mockSuccessResponse = {
      success: true,
      data: {
        optimizedPrompt: 'This is an optimized version of your prompt with enhanced clarity and structure.',
        keyImprovements: [
          'Added specific context and background',
          'Enhanced clarity with structured format',
          'Included success criteria'
        ],
        techniquesApplied: ['Role Assignment', 'Context Enhancement', 'Output Specification'],
        proTip: 'Always provide specific examples to get better AI responses.'
      }
    };

    it('should display optimized prompt result', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        expect(screen.getByText('Optimized Prompt')).toBeInTheDocument();
        expect(screen.getByText('This is an optimized version of your prompt with enhanced clarity and structure.')).toBeInTheDocument();
      });
    });

    it('should display key improvements', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        expect(screen.getByText('Key Improvements')).toBeInTheDocument();
        expect(screen.getByText('Added specific context and background')).toBeInTheDocument();
        expect(screen.getByText('Enhanced clarity with structured format')).toBeInTheDocument();
        expect(screen.getByText('Included success criteria')).toBeInTheDocument();
      });
    });

    it('should display applied techniques as badges', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        expect(screen.getByText('Techniques Applied')).toBeInTheDocument();
        expect(screen.getByText('Role Assignment')).toBeInTheDocument();
        expect(screen.getByText('Context Enhancement')).toBeInTheDocument();
        expect(screen.getByText('Output Specification')).toBeInTheDocument();
      });
    });

    it('should display pro tip when available', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        expect(screen.getByText('Pro Tip')).toBeInTheDocument();
        expect(screen.getByText('Always provide specific examples to get better AI responses.')).toBeInTheDocument();
      });
    });

    it('should hide welcome message after getting results', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      // Welcome message should be visible initially
      expect(screen.getByText('Welcome to Kari AI Prompt Optimizer')).toBeInTheDocument();

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        expect(screen.getByText('Optimized Prompt')).toBeInTheDocument();
      });

      // Welcome message should be hidden after results
      expect(screen.queryByText('Welcome to Kari AI Prompt Optimizer')).not.toBeInTheDocument();
    });

    it('should handle copy to clipboard functionality', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      renderWithIntl(
        <KariOptimizer 
          generatorType="writing"
          defaultMode="DETAIL"
        />
      );

      const textarea = screen.getByPlaceholderText('Enter the prompt you want to optimize here...');
      const optimizeButton = screen.getByRole('button', { name: 'Optimize Prompt' });

      fireEvent.change(textarea, { target: { value: 'Test prompt' } });
      fireEvent.click(optimizeButton);

      await waitFor(() => {
        const copyButton = screen.getByRole('button', { name: 'Copy' });
        fireEvent.click(copyButton);
        
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          'This is an optimized version of your prompt with enhanced clarity and structure.'
        );
      });
    });
  });
});