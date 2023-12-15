// import { UserCredential } from 'firebase/auth';

// ----------------------------------------------------------------------

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUser = null | Record<string, any>;

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
};

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: 'jwt';
  sendotp: (email: string, login: boolean, name?: string, passcode?: string, event_id?: number) => Promise<void>;
  verifyotp: (
    email?: string,
    otp?: string,
    name?: string,
    account_type?: string,
    plan_id?: string,
    event_id?: number,
    agency_id?: number | null,
    passcode?:string,

  ) => Promise<void>;
  socialauth: () => Promise<void>;
  profileData: () => Promise<void>;
  teamRegistration: (
    email: string,
    name: string,
    invite_token: string,
    account_type: string
  ) => Promise<void>;
  clientRegistration: (
    email: string,
    name: string,
    event_id: string,
    agency_id: string,
    account_type: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};
