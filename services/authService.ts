
import { User } from '../types';

interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Mock authentication service
 */
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Demo accounts logic
    if (email === 'admin@nexusagency.com' && password === 'password') {
      return {
        user: {
          id: 'u1',
          email: 'admin@nexusagency.com',
          // Fix: firstName -> first_name to align with User interface
          first_name: 'Admin',
          // Fix: lastName -> last_name to align with User interface
          last_name: 'User',
          role: 'admin',
          status: 'active',
          avatar_url: 'https://picsum.photos/seed/admin/100/100',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as User,
        token: 'mock-jwt-token-admin',
      };
    }

    if (email === 'rep@nexusagency.com' && password === 'password') {
      return {
        user: {
          id: 'u2',
          email: 'rep@nexusagency.com',
          // Fix: firstName -> first_name to align with User interface
          first_name: 'Sarah',
          // Fix: lastName -> last_name to align with User interface
          last_name: 'Miller',
          // Fix: Type '"sales_rep"' is now valid as we updated UserRole in types.ts
          role: 'sales_rep',
          status: 'active',
          avatar_url: 'https://picsum.photos/seed/sarah/100/100',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as User,
        token: 'mock-jwt-token-rep',
      };
    }

    throw new Error('Invalid email or password');
  },

  logout: () => {
    // Clean up if needed
  },

  getCurrentUser: (): User | null => {
    // Usually retrieved from a token decode or state
    return null;
  },

  refreshToken: async (): Promise<string> => {
    return 'new-mock-jwt-token';
  }
};
