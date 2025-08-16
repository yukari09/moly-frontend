import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KariOptimizer } from '@/components/generators/KariOptimizer';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock fetch
global.fetch = vi.fn();

const messages = {
  KariOptimizer: {
    welcome: {
      title: 'Meet Kari - Your AI Prompt Optimization Expert',
      message: 'I\'ll transform your prompt using advanced 4-D methodology to unlock maximum AI potential. Choose your optimization mode:',
      basicMode: 'Quick optimization with core improvements and instant results',
      detailMode: 'Deep analysis with clarifying questions and advanced techniques'
    },
    input: {
      title: 'Enter Your Prompt',
      placeholder: 'Describe what you want to create or achieve...',
      platform: 'Target Platform',
      mode: 'Optimization Mode',
      optimize: 'Optimize with Kari',
      optimizing: 'Optimizing...'
    },
    result: {
      optimizedPrompt: 'Your Optimized Prompt',
      copy: 'Copy',
      improvements: 'Key Improvements',
      techniques: 'Techniques Applied',
      proTip: 'Pro Tip'
    },
    errors: {
      optimizationFailed: 'Optimization failed. Please try again.',
      networkError: 'Network error. Please check your connection.',
      emptyPrompt: 'Please enter a prompt to optimize.',
      promptTooShort: 'Prompt should be at least 10 characters long.',
      promptTooLong: 'Prompt should be less than 2000 characters.'
    },
    success: {
      copied: 'Copied to clipboard!',
      optimized: 'Prompt optimized successfully!'
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

describe('KariOptimizer Error Handling and Loading States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  it('should show validation error for empty prompt', async () => {
    renderWithIntl(<KariOptimizer generatorType="writing" />);
    
    const optimizeButton = screen.getByText('Optimize with Kari');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a prompt to optimize.')).toBeInTheDocument();
    });
  });

  it('should show validation error for short prompt', async () => {
    renderWithIntl(<KariOptimizer generatorType="writing" />);
    
    const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
    fireEvent.change(textarea, { target: { value: 'short' } });
    
    const optimizeButton = screen.getByText('Optimize with Kari');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Prompt should be at least 10 characters long.')).toBeInTheDocument();
    });
  });

  it('should show character counter', () => {
    renderWithIntl(<KariOptimizer generatorType="writing" />);
    
    const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    
    expect(screen.getByText('11/2000 characters')).toBeInTheDocument();
  });

  it('should show loading state during optimization', async () => {
    global.fetch.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            optimizedPrompt: 'Optimized prompt',
            keyImprovements: ['Better clarity'],
            techniquesApplied: ['Role Assignment']
          }
        })
      }), 100))
    );

    renderWithIntl(<KariOptimizer generatorType="writing" />);
    
    const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing' } });
    
    const optimizeButton = screen.getByText('Optimize with Kari');
    fireEvent.click(optimizeButton);
    
    // Should show loading state
    expect(screen.getByText('Optimizing...')).toBeInTheDocument();
    expect(screen.getByText('Kari is optimizing your prompt...')).toBeInTheDocument();
    
    // Should disable form elements during loading
    expect(textarea).toBeDisabled();
    expect(optimizeButton).toBeDisabled();
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle network error', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    renderWithIntl(<KariOptimizer generatorType="writing" />);
    
    const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing' } });
    
    const optimizeButton = screen.getByText('Optimize with Kari');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
    });
    
    expect(toast.error).toHaveBeenCalledWith('Network error. Please check your connection.');
  });

  it('should handle API error response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({
        success: false,
        error: 'Server error'
      })
    });

    renderWithIntl(<KariOptimizer generatorType="writing" />);
    
    const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing' } });
    
    const optimizeButton = screen.getByText('Optimize with Kari');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Request failed with status 500')).toBeInTheDocument();
    });
  });

  it('should show retry button on error', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    renderWithIntl(<KariOptimizer generatorType="writing" />);
    
    const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing' } });
    
    const optimizeButton = screen.getByText('Optimize with Kari');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('should copy to clipboard successfully', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue()
      }
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          optimizedPrompt: 'Optimized prompt',
          keyImprovements: ['Better clarity'],
          techniquesApplied: ['Role Assignment']
        }
      })
    });

    renderWithIntl(<KariOptimizer generatorType="writing" />);
    
    const textarea = screen.getByPlaceholderText('Describe what you want to create or achieve...');
    fireEvent.change(textarea, { target: { value: 'This is a valid prompt for testing' } });
    
    const optimizeButton = screen.getByText('Optimize with Kari');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
    });
    
    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Optimized prompt');
    expect(toast.success).toHaveBeenCalledWith('Copied to clipboard!');
  });
});