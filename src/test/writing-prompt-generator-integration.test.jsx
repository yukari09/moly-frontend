import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import WritingPromptGenerator from '@/app/[locale]/writing-prompt-generator/page.jsx';

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
  WritingGenerator: {
    title: 'Writing Prompt Generator',
    description: 'Use Kari AI to create perfect writing prompts for various creative writing projects.',
    features: {
      types: {
        title: 'Multiple Types',
        description: 'Supports novels, poetry, scripts, blogs and various writing types'
      },
      difficulty: {
        title: 'Difficulty Levels',
        description: 'Different difficulty options from beginners to professional writers'
      },
      themes: {
        title: 'Theme Tags',
        description: 'Rich selection of themes: science fiction, romance, mystery, etc.'
      }
    }
  },
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

describe('Writing Prompt Generator Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the complete writing-prompt-generator page', () => {
    expect(() => {
      renderWithIntl(<WritingPromptGenerator />);
    }).not.toThrow();
  });

  it('should display page title and description', () => {
    renderWithIntl(<WritingPromptGenerator />);

    expect(screen.getByText('Writing Prompt Generator')).toBeInTheDocument();
    expect(screen.getByText('Use Kari AI to create perfect writing prompts for various creative writing projects.')).toBeInTheDocument();
  });

  it('should render KariOptimizer component with correct props', () => {
    renderWithIntl(<WritingPromptGenerator />);

    // Verify KariOptimizer is rendered with welcome message
    expect(screen.getByText('Welcome to Kari AI Prompt Optimizer')).toBeInTheDocument();
    
    // Verify the input form is present
    expect(screen.getByPlaceholderText('Enter the prompt you want to optimize here...')).toBeInTheDocument();
    
    // Verify the optimize button is present
    expect(screen.getByRole('button', { name: 'Optimize Prompt' })).toBeInTheDocument();
  });

  it('should display feature descriptions', () => {
    renderWithIntl(<WritingPromptGenerator />);

    expect(screen.getByText('Multiple Types')).toBeInTheDocument();
    expect(screen.getByText('Difficulty Levels')).toBeInTheDocument();
    expect(screen.getByText('Theme Tags')).toBeInTheDocument();
    
    expect(screen.getByText('Supports novels, poetry, scripts, blogs and various writing types')).toBeInTheDocument();
    expect(screen.getByText('Different difficulty options from beginners to professional writers')).toBeInTheDocument();
    expect(screen.getByText('Rich selection of themes: science fiction, romance, mystery, etc.')).toBeInTheDocument();
  });

  it('should have proper page structure and layout', () => {
    renderWithIntl(<WritingPromptGenerator />);

    // Check for main container
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('max-w-screen-xl', 'mx-auto', 'px-6', 'py-12');

    // Check for title section
    const title = screen.getByText('Writing Prompt Generator');
    expect(title).toHaveClass('text-4xl', 'md:text-5xl', 'font-bold');

    // Check for features grid
    const featuresGrid = screen.getByText('Multiple Types').closest('.grid');
    expect(featuresGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
  });
});