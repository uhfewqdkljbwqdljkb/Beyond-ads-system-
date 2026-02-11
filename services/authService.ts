
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
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          avatar: 'https://picsum.photos/seed/admin/100/100',
          teamLeadId: null,
          commissionStructureId: 'cs-global-admin',
        },
        token: 'mock-jwt-token-admin',
      };
    }

    if (email === 'rep@nexusagency.com' && password === 'password') {
      return {
        user: {
          id: 'u2',
          email: 'rep@nexusagency.com',
          firstName: 'Sarah',
          lastName: 'Miller',
          role: 'sales_rep',
          avatar: 'https://picsum.photos/seed/sarah/100/100',
          teamLeadId: 'u3',
          commissionStructureId: 'cs-standard-rep',
        },
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
