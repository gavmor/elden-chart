import { useState, useMemo } from 'react';
import { z } from 'zod';
import type { ColorKey } from '../components/types';

// Define Zod schema to parse and validate URL query parameters
export const queryParamsSchema = z.object({
  x: z.string().default('weight'),
  y: z.string().default('weight'),
  color: z.string().default('category').transform(val => val as ColorKey),
  q: z.string().default(''),
  cats: z.string().nullable().transform(val => val ? val.split(',').filter(Boolean) : null).default(null),
});

export type ValidatedQueryParams = z.infer<typeof queryParamsSchema>;

export function useValidatedParams() {
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(window.location.search));

  // Parse and validate current searchParams using Zod schema
  const params = useMemo(() => {
    const raw = {
      x: searchParams.get('x') ?? undefined,
      y: searchParams.get('y') ?? undefined,
      color: searchParams.get('color') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      cats: searchParams.get('cats') ?? null,
    };
    return queryParamsSchema.parse(raw);
  }, [searchParams]);

  // Set/update a specific URL query parameter reactively
  const setParam = (key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (
        value === null ||
        value === '' ||
        (key === 'x' && value === 'weight') ||
        (key === 'y' && value === 'weight') ||
        (key === 'color' && value === 'category')
      ) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      const qs = next.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
      return next;
    });
  };

  return {
    params,
    setParam,
    searchParams,
  };
}
