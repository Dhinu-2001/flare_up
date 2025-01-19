import axios from "axios";
import Cookies from 'js-cookie'
import { decryptToken, isTokenExpired, refreshAccessToken, } from './utils/tokenUtil'
import { handleLogout } from "./utils/StateUtil";
import { store } from "./redux/Store";
import { env } from "@/utils/env";

import { getConfig } from './config';
let { VITE_gateway_svc } = getConfig();

VITE_gateway_svc = VITE_gateway_svc || env.VITE_gateway_svc

// baseURL: 'http://meetmingle.com/', FOR DOCKER

const axiosInstance = axios.create({
  baseURL: `https://${VITE_gateway_svc}/api/`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  config => {
    const state = store.getState()
    const accessTokenFromState = state.accessToken

    const csrfToken = Cookies.get('csrftoken');
    const token = decryptToken(accessTokenFromState)
    console.log('accessToken before sending request: ', token)
    console.log('CSRF token before sending request: ', csrfToken)

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    else {
      console.warn('CSRF token missing!')
    }

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    } else {
      console.warn('CSRF token missing!')
    }

    return config;
  }, error => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(error)

    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Call refresh token endpoint

      const state = store.getState()
      const { accessToken, refreshToken } = state;
      const decryptedAccessToken = decryptToken(accessToken)
      const decryptedRefreshToken = decryptToken(refreshToken)

      console.log('setting tokens for refresh:', decryptedAccessToken, decryptedRefreshToken)

      if (decryptedAccessToken && isTokenExpired(decryptedAccessToken)) {
        console.log('Access token is expired. Attempting to refresh it.');

        try {
          const newAccessToken = await refreshAccessToken(decryptedRefreshToken);

          if (newAccessToken) {
            console.log('Access token refreshed successfully. Retrying the original request.');
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest);
          }
          else {
            console.error('Failed to refresh access token. Logging out.');
            await handleLogout();
            // window.location.href = '/login';
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error('Error during token refresh:', refreshError);
          await handleLogout();
          return Promise.reject(refreshError);
        }

      }
      else {
        console.warn('No access token found or token is not valid. Logging out.');
        await handleLogout();
        // window.location.href = '/login';
        console.warn('No access token found or token is not valid. Logging out.');
        return Promise.reject(error);
      }

    }
    return Promise.reject(error);
  }
);

export default axiosInstance