import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
  initializeSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (session) => {
    if (session) {
      // Always store session in localStorage for persistence
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      }));
    } else {
      // Clear session storage when logging out
      localStorage.removeItem('supabase.auth.token');
    }
    set({ session });
  },
  clearSession: () => {
    localStorage.removeItem('supabase.auth.token');
    set({ session: null });
  },
  initializeSession: async () => {
    const supabase = createClientComponentClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      set({ session });
    } else {
      set({ session: null });
    }
  },
})); 