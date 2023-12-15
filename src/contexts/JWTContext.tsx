import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from 'src/utils/axios';
import { isValidToken, setSession, setCookie } from 'src/utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from 'src/@types/auth';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Logout = 'LOGOUT',
  VerifyOtp = 'VERIFYOTP',
  SendOtp = 'SENDOTP',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };

  [Types.Logout]: undefined;

  [Types.VerifyOtp]: {
    user: AuthUser;
  };
  [Types.SendOtp]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'SENDOTP':
      return {
        ...state,
        isAuthenticated: false,
        user: action.payload.user,
      };

    case 'VERIFYOTP':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const getCookie = (name: string) => {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  useEffect(() => {
    const initialize = async () => {
      try {
        const checkCookie = getCookie('sso_flag');
        let api_token;
        if (!checkCookie) {
          api_token = window.localStorage.getItem('api_token');
        } else if (checkCookie === '0') {
          api_token = null;
        } else if (checkCookie === '1') {
          api_token = window.localStorage.getItem('api_token');
        }
        if (!api_token) {
          if (checkCookie === '1') {
            api_token = getCookie('api_token');
          }
        }
        if (api_token && isValidToken(api_token)) {
          setSession(api_token);
          const response = await axios.get('/api/user/profile');
          const { data } = response.data;
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: data,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const sendotp = async (
    email: string,
    login: boolean,
    name?: string,
    passcode?: string,
    event_id?: number
  ) => {
    const response = await axios.post('/api/auth/otp/send', {
      email,
      login,
      name,
      passcode,
      event_id,
    });
    const { data } = response.data;
    dispatch({
      type: Types.SendOtp,
      payload: {
        user: data.user,
      },
    });
  };

  const verifyotp = async (
    email?: string,
    otp?: string,
    name?: string,
    account_type?: string,
    plan_id?: string,
    event_id?: number,
    agency_id?: number | null,
    passcode?: string
  ) => {
    const response = await axios.post('/api/auth/otp/verify', {
      email,
      otp,
      name,
      account_type,
      plan_id,
      event_id,
      agency_id,
      passcode,
    });
    const { data } = response.data;

    setSession(data.api_token);

    dispatch({
      type: Types.VerifyOtp,
      payload: {
        user: data.user,
      },
    });
  };

  const teamRegistration = async (
    email: string,
    name: string,
    invite_token: string,
    account_type: string
  ) => {
    const response = await axios.post('/api/auth/invite/accept', {
      email,
      name,
      invite_token,
      account_type,
    });
    const { data } = response.data;
    setSession(data.api_token);

    dispatch({
      type: Types.VerifyOtp,
      payload: {
        user: data.user,
      },
    });
  };

  const clientRegistration = async (
    email: string,
    name: string,
    event_id: string,
    agency_id: string,
    account_type: string
  ) => {
    const response = await axios.post('/api/auth/client/register', {
      email,
      name,
      event_id,
      agency_id,
      account_type,
    });
    const { data } = response.data;
    setSession(data.api_token);

    dispatch({
      type: Types.VerifyOtp,
      payload: {
        user: data.user,
      },
    });
  };

  const profileData = async () => {
    const response = await axios.get('/api/user/profile');
    const { data } = response.data;
    dispatch({
      type: Types.Initial,
      payload: {
        isAuthenticated: true,
        user: data,
      },
    });
  };

  const socialauth = async () => {
    const api_token = window.localStorage.getItem('api_token');
    if (api_token && isValidToken(api_token)) {
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: true,
          user: null,
        },
      });
    } else {
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
    localStorage.clear();
    setCookie('sso_flag', '0');
    const deleteCookie = (name: any) => {
      document.cookie = `${name}=; path=/; domain=${process.env.REACT_APP_MAIN_DOMAIN}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    };
    deleteCookie('api_token');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        sendotp,
        verifyotp,
        socialauth,
        profileData,
        teamRegistration,
        clientRegistration,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
