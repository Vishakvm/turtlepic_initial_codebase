import axios from 'axios';
// config
import { HOST_API } from 'src/config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);
// INTERCEPTOR FOR SUBDOMAIN
// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log('config', config);
//     if (!config?.headers) {
//       throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
//     }
//     config.headers.Test = `hello`;
//     return config;
//   },
//   (error) => {
//     Promise.reject(error);
//   }
// );
export default axiosInstance;
