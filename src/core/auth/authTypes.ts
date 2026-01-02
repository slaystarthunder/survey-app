// /src/core/auth/authTypes.ts

export type AuthUser = {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
  };
  
  export type AuthStatus = "loading" | "anon" | "authed";
  
  export type AuthState = {
    status: AuthStatus;
    user: AuthUser | null;
  };
  