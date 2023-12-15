import jwtDecode from 'jwt-decode';
//
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

const isValidToken = (api_token: string) => {
  if (!api_token) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(api_token);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

//  const handleTokenExpired = (exp: any) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };
export const setCookie = (name: string, value: string) => {
  document.cookie =
    name + '=' + (value || '') + `; path=/;domain=${process.env.REACT_APP_MAIN_DOMAIN}`;
};

const setSession = (api_token: string | null) => {
  if (api_token) {
    localStorage.setItem('api_token', api_token);
    setCookie('sso_flag', '1');
    setCookie('api_token', api_token);
    axios.defaults.headers.common.Authorization = `Bearer ${api_token}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(api_token);
    // handleTokenExpired(exp);
  } else {
    setCookie('sso_flag', '0');
    localStorage.removeItem('api_token');
    const deleteCookie = (name: any) => {
      document.cookie = `${name}=; path=/; domain=${process.env.REACT_APP_MAIN_DOMAIN}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    };
    deleteCookie('api_token');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
