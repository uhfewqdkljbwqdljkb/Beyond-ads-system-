import { useState, useEffect, useCallback } from 'react';
import { searchService } from '../services/searchService';

export const useGlobalSearch = (query) => {
  const [results, setResults] = useState({ leads: [], deals: [], clients: [], invoices: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults({ leads: [], deals: [], clients: [], invoices: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await searchService.globalSearch(searchQuery);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  return { results, isLoading, error };
};
