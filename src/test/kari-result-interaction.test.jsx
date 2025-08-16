import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KariOptimizer } from '@/components/generators/KariOptimizer';
import { vi } from 'vitest';

// Mock sonner toast
const mockToast = {
  success: vi.fn(),
  error: vi.fn()
};

vi.mock('sonner', () => ({
  toast: mockToast
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve())
  }
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

const messages = {
  KariOptimizer: {
    welcome: {
      title: "Meet Kari - Your AI Prompt Optimization Expert",
      message: "I'll transform your prompt using advanced 4-D methodology",
      basicMode: "Quick optimization",
      detailMode: "Deep analysis"
    },
    input: {
      title: "Enter Your Prompt",
      placeholder: "Describe what you want to create...",
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
    success: {
      copied: "Copied to clipboard!",
      optimized: "Prompt optimized successfully!",
      saved: "Result saved successfully!",
      deleted: "Result deleted successfully!",
      loaded: "Result loaded successfully!",
      shared: "Shared successfully!",
      shareLink: "Share link copied to clipboard!"
    },
    errors: {
      emptyPrompt: "Please enter a prompt to optimize.",
      saveFailed: "Failed to save result.",
      shareFailed: "Failed to share result."
    },
    saved: {
      title: "Saved Results",
      empty: "No saved results yet.",
      load: "Load this result",
      delete: "Delete this result"
    }
  }
};

const renderKariOptimizer = (props = {}) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <KariOptimizer generatorType="writing" {...props} />
    </NextIntlClientProvider>
  );
};

describe('KariOptimizer Result Interaction Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Copy to Clipboard', () => {
    test('should copy optimized prompt to clipboard', async () => {
      // Mock a successful optimization result
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              optimizedPrompt: "This is an optimized prompt",
              keyImprovements: ["Better clarity"],
              techniquesApplied: ["Role assignment"]
            }
          })
        })
      );

      renderKariOptimizer();

      // Enter a prompt and optimize
      const textarea = screen.getByPlaceholderText('Describe what you want to create...');
      fireEvent.change(textarea, { target: { value: 'Test prompt for optimization' } });

      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);

      // Wait for result to appear
      await waitFor(() => {
        expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
      });

      // Click copy button
      const copyButton = screen.getByText('Copy');
      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('This is an optimized prompt');
      expect(mockToast.success).toHaveBeenCalledWith('Copied to clipboard!');
    });
  });

  describe('Save Result', () => {
    test('should save result to localStorage', async () => {
      // Mock a successful optimization result
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              optimizedPrompt: "This is an optimized prompt",
              keyImprovements: ["Better clarity"],
              techniquesApplied: ["Role assignment"]
            }
          })
        })
      );

      renderKariOptimizer();

      // Enter a prompt and optimize
      const textarea = screen.getByPlaceholderText('Describe what you want to create...');
      fireEvent.change(textarea, { target: { value: 'Test prompt for optimization' } });

      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);

      // Wait for result to appear
      await waitFor(() => {
        expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
      });

      // Click save button
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'kari-saved-results',
        expect.stringContaining('This is an optimized prompt')
      );
      expect(mockToast.success).toHaveBeenCalledWith('Result saved successfully!');
    });
  });

  describe('Share Result', () => {
    test('should share result using Web Share API when available', async () => {
      // Mock Web Share API
      const mockShare = vi.fn(() => Promise.resolve());
      const mockCanShare = vi.fn(() => true);
      Object.assign(navigator, {
        share: mockShare,
        canShare: mockCanShare
      });

      // Mock a successful optimization result
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              optimizedPrompt: "This is an optimized prompt",
              keyImprovements: ["Better clarity"],
              techniquesApplied: ["Role assignment"]
            }
          })
        })
      );

      renderKariOptimizer();

      // Enter a prompt and optimize
      const textarea = screen.getByPlaceholderText('Describe what you want to create...');
      fireEvent.change(textarea, { target: { value: 'Test prompt for optimization' } });

      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);

      // Wait for result to appear
      await waitFor(() => {
        expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
      });

      // Click share button
      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: 'Optimized Prompt - writing',
          text: expect.stringContaining('Test prompt for optimization'),
          url: expect.any(String)
        });
        expect(mockToast.success).toHaveBeenCalledWith('Shared successfully!');
      });
    });

    test('should fallback to clipboard when Web Share API is not available', async () => {
      // Mock Web Share API as not available
      delete navigator.share;
      delete navigator.canShare;

      // Mock a successful optimization result
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              optimizedPrompt: "This is an optimized prompt",
              keyImprovements: ["Better clarity"],
              techniquesApplied: ["Role assignment"]
            }
          })
        })
      );

      renderKariOptimizer();

      // Enter a prompt and optimize
      const textarea = screen.getByPlaceholderText('Describe what you want to create...');
      fireEvent.change(textarea, { target: { value: 'Test prompt for optimization' } });

      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);

      // Wait for result to appear
      await waitFor(() => {
        expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
      });

      // Click share button
      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          expect.stringContaining('Optimized Prompt - writing')
        );
        expect(mockToast.success).toHaveBeenCalledWith('Share link copied to clipboard!');
      });
    });
  });

  describe('Regenerate Prompt', () => {
    test('should regenerate prompt with same parameters', async () => {
      // Mock a successful optimization result
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              optimizedPrompt: "This is an optimized prompt",
              keyImprovements: ["Better clarity"],
              techniquesApplied: ["Role assignment"]
            }
          })
        })
      );

      renderKariOptimizer();

      // Enter a prompt and optimize
      const textarea = screen.getByPlaceholderText('Describe what you want to create...');
      fireEvent.change(textarea, { target: { value: 'Test prompt for optimization' } });

      const optimizeButton = screen.getByText('Optimize with Kari');
      fireEvent.click(optimizeButton);

      // Wait for result to appear
      await waitFor(() => {
        expect(screen.getByText('Your Optimized Prompt')).toBeInTheDocument();
      });

      // Clear the fetch mock to track new calls
      global.fetch.mockClear();

      // Click regenerate button
      const regenerateButton = screen.getByText('Regenerate');
      fireEvent.click(regenerateButton);

      // Should make another API call with same parameters
      expect(global.fetch).toHaveBeenCalledWith('/api/kari/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Test prompt for optimization',
          platform: 'chatgpt',
          generatorType: 'writing',
          mode: 'BASIC',
          locale: 'en'
        }),
        signal: expect.any(AbortSignal)
      });
    });
  });

  describe('Saved Results Management', () => {
    test('should load saved results from localStorage on mount', () => {
      const savedResults = JSON.stringify([
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          originalPrompt: 'Original prompt',
          optimizedPrompt: 'Optimized prompt',
          platform: 'chatgpt',
          mode: 'BASIC',
          generatorType: 'writing'
        }
      ]);

      localStorageMock.getItem.mockReturnValue(savedResults);

      renderKariOptimizer();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('kari-saved-results');
    });

    test('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderKariOptimizer();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load saved results:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});