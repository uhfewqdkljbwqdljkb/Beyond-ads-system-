import { supabase, handleError } from './api.js';

/**
 * Authentication Service
 * Manages user sessions, profile fetching, and security.
 */
export const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    try {
      // In a real environment, this calls Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // Attempt to fetch profile data from the users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
        
      // Fallback for demo/mock mode if no real user exists in DB
      if (profileError || !profile) {
        if (email === 'admin@agency.com' || email === 'admin@nexusagency.com') {
           return {
             user: {
               id: 'demo-admin-id',
               email: email,
               first_name: 'Admin',
               last_name: 'User',
               role: 'admin',
               avatar_url: 'https://picsum.photos/seed/admin/100/100'
             },
             token: 'demo-token'
           };
        }
        return {
          user: {
            id: 'demo-rep-id',
            email: email,
            first_name: 'Sarah',
            last_name: 'Miller',
            role: 'sales_rep',
            avatar_url: 'https://picsum.photos/seed/sarah/100/100'
          },
          token: 'demo-token'
        };
      }
      
      return { user: profile, session: data?.session };
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Logout current user
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get current authenticated user session and profile
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return null;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) return null;
      return profile;
    } catch (error) {
      return null;
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
    }
  }
};