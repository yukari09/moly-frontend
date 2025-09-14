import { describe, it, expect, vi, fn, afterEach, beforeEach } from 'vitest';
import { listTermsOffset } from '../lib/graphql';

// Mock the logger to avoid errors during test
// By importing `fn` directly, we avoid issues with `vi` object reference inside the factory
vi.mock('../lib/logger', () => ({
  default: {
    error: fn(),
    warn: fn(),
  }
}));

describe('GraphQL Caching', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(mockFetch);
    mockFetch.mockResolvedValue(new Response(JSON.stringify({
      data: {
        listTermsOffset: {
          results: ['test']
        }
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass a "next.next" object to fetch when cacheConfig is passed incorrectly', async () => {
    const incorrectCacheConfig = { next: { revalidate: 3600 } };

    await listTermsOffset(
      "category",
      100,
      0,
      null,
      null,
      null,
      null,
      null,
      incorrectCacheConfig
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const fetchOptions = mockFetch.mock.calls[0][1];

    expect(fetchOptions.next).toEqual({
      next: { revalidate: 3600 }
    });
    expect(fetchOptions.cache).toBeUndefined();
  });

  it('should pass a correct "next" object to fetch when cacheConfig is passed correctly', async () => {
    const correctCacheConfig = { revalidate: 3600 };

    await listTermsOffset(
      "category",
      100,
      0,
      null,
      null,
      null,
      null,
      null,
      correctCacheConfig
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const fetchOptions = mockFetch.mock.calls[0][1];

    expect(fetchOptions.next).toEqual({
      revalidate: 3600
    });
    expect(fetchOptions.cache).toBeUndefined();
  });

  it('should pass { cache: \'no-store\' } to fetch when cacheConfig is null', async () => {
    await listTermsOffset(
      "category",
      100,
      0,
      null,
      null,
      null,
      null,
      null,
      null
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const fetchOptions = mockFetch.mock.calls[0][1];

    expect(fetchOptions.cache).toBe('no-store');
    expect(fetchOptions.next).toBeUndefined();
  });
});
