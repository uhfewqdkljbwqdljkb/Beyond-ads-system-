
import { supabase, handleError } from './api';
import type { User, UpdateUserPayload, UserRole, UserStatus } from '../types';

export const userService = {
  async getUsers(filters?: { role?: UserRole; status?: UserStatus; team_id?: string; search?: string }) {
    let query = supabase.from('users').select(`*, team:teams(*), manager:manager_id(id, first_name, last_name, email)`).order('created_at', { ascending: false });

    if (filters?.role) query = query.eq('role', filters.role);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.team_id) query = query.eq('team_id', filters.team_id);
    if (filters?.search) query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data as User[];
  },

  async getUserById(id: string) {
    const { data, error } = await supabase.from('users').select(`*, team:teams(*), manager:manager_id(id, first_name, last_name, email)`).eq('id', id).single();
    if (error) throw error;
    return data as User;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return this.getUserById(user.id);
  },

  async updateUser(id: string, payload: any) {
    const { data, error } = await supabase.from('users').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data as User;
  },

  async updateLastLogin(userId: string) {
    const { error } = await supabase.rpc('update_last_login', { p_user_id: userId });
    if (error) throw error;
  }
};
