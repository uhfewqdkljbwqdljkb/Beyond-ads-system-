import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

/**
 * Safely retrieves environment variables from common JS environment locations.
 * Prevents crashes in environments where import.meta.env is undefined.
 */
const getEnv = (key) => {
  try {
    // Check Vite/ESM style env
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key];
    }
  } catch (e) {}

  try {
    // Check Node/Process style env
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {}

  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

/**
 * A robust chainable mock client to prevent downstream crashes if Supabase is not configured.
 * This allows the UI to render and function in a "mock mode".
 */
const createMockChain = () => {
  const chain = {
    // All possible chainable methods in Supabase JS client
    select: () => chain,
    from: () => chain,
    eq: () => chain,
    neq: () => chain,
    gt: () => chain,
    gte: () => chain,
    lt: () => chain,
    lte: () => chain,
    like: () => chain,
    ilike: () => chain,
    is: () => chain,
    in: () => chain,
    contains: () => chain,
    containedBy: () => chain,
    range: () => chain,
    limit: () => chain,
    order: () => chain,
    or: () => chain,
    match: () => chain,
    not: () => chain,
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    upsert: () => chain,
    rpc: () => chain,
    // Methods that return a final promise/value
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    csv: () => Promise.resolve({ data: '', error: null }),
    // The chain itself is thenable to support direct await query
    then: (resolve) => resolve({ data: [], count: 0, error: null })
  };
  return chain;
};

const mockSupabase = {
  from: () => createMockChain(),
  auth: {
    signInWithPassword: () => Promise.resolve({ data: { session: { user: {} } }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    updateUser: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  rpc: () => createMockChain(),
  storage: { 
    from: () => ({ 
      upload: () => Promise.resolve({}), 
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      list: () => Promise.resolve({ data: [], error: null }),
      remove: () => Promise.resolve({ error: null }),
    }) 
  }
};

/**
 * Global Supabase Client Instance
 * Uses the real client if keys are available, otherwise falls back to the mock client.
 */
export const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '')
  ? createClient(supabaseUrl, supabaseKey)
  : mockSupabase;

/**
 * Standardized Error Handler
 */
export const handleError = (error) => {
  console.error('API Error:', error);
  // We throw a user-friendly message
  throw new Error(error.message || 'An unexpected error occurred during the API request');
};

/**
 * Pagination Helper
 */
export const paginate = (query, page = 1, limit = 20) => {
  if (!query || typeof query.range !== 'function') return query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return query.range(from, to);
};
