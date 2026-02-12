import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService.ts';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          set({ 
            user: response.user, 
            token: response.token, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      checkAuth: () => {
        const user = authService.getCurrentUser();
        if (user) {
          set({ user, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'nexus-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);