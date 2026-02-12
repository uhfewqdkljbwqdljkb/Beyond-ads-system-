import { createClient } from '@supabase/supabase-js';

/**
 * Safely retrieves environment variables.
 */
const getEnv = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) return import.meta.env[key];
  } catch (e) {}
  try {
    if (typeof process !== 'undefined' && process.env) return process.env[key];
  } catch (e) {}
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

// In-memory store for mock mode
const memoryStore = {
  leads: [],
  deals: [],
  clients: [],
  invoices: [],
  users: [
    { id: 'u1', first_name: 'Admin', last_name: 'User', email: 'admin@nexusagency.com', role: 'admin' },
    { id: 'u2', first_name: 'Sarah', last_name: 'Miller', email: 'rep@nexusagency.com', role: 'sales_rep' }
  ],
  pipeline_stages: [
    { id: 'stage-1', name: 'Discovery', color: '#3B82F6', stage_order: 1 },
    { id: 'stage-2', name: 'Qualification', color: '#6366F1', stage_order: 2 },
    { id: 'stage-3', name: 'Proposal', color: '#8B5CF6', stage_order: 3 },
    { id: 'stage-4', name: 'Negotiation', color: '#EC4899', stage_order: 4 },
    { id: 'stage-5', name: 'Closed Won', color: '#10B981', stage_order: 5 },
  ],
  industries: [
    { id: 'ind-1', name: 'Technology' },
    { id: 'ind-2', name: 'Healthcare' },
    { id: 'ind-3', name: 'Finance' },
    { id: 'ind-4', name: 'E-commerce' }
  ],
  lead_sources: [
    { id: 'src-1', name: 'LinkedIn', is_active: true },
    { id: 'src-2', name: 'Referral', is_active: true },
    { id: 'src-3', name: 'Website', is_active: true }
  ]
};

/**
 * Creates a stateful mock client that persists data in memory during the session.
 */
const createStatefulMockChain = (table) => {
  const queryBuilder = {
    // Queries
    select: () => queryBuilder,
    insert: (data) => {
      const rows = Array.isArray(data) ? data : [data];
      const newRows = rows.map(r => ({
        id: `mock-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...r
      }));
      
      if (!memoryStore[table]) memoryStore[table] = [];
      memoryStore[table].unshift(...newRows);

      return {
        select: () => ({
          single: () => Promise.resolve({ data: newRows[0], error: null }),
          then: (resolve) => resolve({ data: newRows, error: null })
        }),
        then: (resolve) => resolve({ data: null, error: null })
      };
    },
    update: (updates) => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { ...updates }, error: null }),
          then: (resolve) => resolve({ data: [updates], error: null })
        }),
        then: (resolve) => resolve({ data: [updates], error: null })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null })
    }),
    
    // Filters & Modifiers - Return queryBuilder to allow chaining
    eq: () => queryBuilder,
    neq: () => queryBuilder,
    gt: () => queryBuilder,
    lt: () => queryBuilder,
    gte: () => queryBuilder,
    lte: () => queryBuilder,
    like: () => queryBuilder,
    ilike: () => queryBuilder,
    is: () => queryBuilder,
    in: () => queryBuilder,
    contains: () => queryBuilder,
    or: () => queryBuilder,
    not: () => queryBuilder,
    
    order: () => queryBuilder,
    limit: () => queryBuilder,
    offset: () => queryBuilder,
    range: () => queryBuilder,
    
    // Terminators
    single: () => {
        const item = memoryStore[table]?.[0] || null;
        return Promise.resolve({ data: item, error: null });
    },
    maybeSingle: () => {
        const item = memoryStore[table]?.[0] || null;
        return Promise.resolve({ data: item, error: null });
    },
    then: (resolve, reject) => {
       const data = memoryStore[table] || [];
       // Return promise that resolves with data structure matching Supabase response
       return Promise.resolve({ data, count: data.length, error: null }).then(resolve, reject);
    }
  };

  return queryBuilder;
};

const mockSupabase = {
  from: (table) => createStatefulMockChain(table),
  auth: {
    signInWithPassword: () => Promise.resolve({ data: { session: { user: { id: 'mock-user' } } }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: { id: 'mock-user' } }, error: null }),
    updateUser: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: { user: { id: 'mock-user' } } }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  rpc: () => ({ then: (resolve) => resolve({ data: {}, error: null }) }),
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
 * Uses the real client if keys are available, otherwise falls back to the stateful mock client.
 */
export const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '')
  ? createClient(supabaseUrl, supabaseKey)
  : mockSupabase;

export const handleError = (error) => {
  console.error('API Error:', error);
  throw new Error(error.message || 'An unexpected error occurred');
};

export const paginate = (query, page = 1, limit = 20) => {
  if (!query || typeof query.range !== 'function') return query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return query.range(from, to);
};