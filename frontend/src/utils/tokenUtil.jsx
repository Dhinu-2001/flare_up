import { store } from '@/redux/Store';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from "@/axiosconfig"
import { setAuthData } from '@/redux/auth/authSlice';

// Regular utility functions for encryption/decryption
export const encryptToken = (token) => {
  console.log('encrypt:', token)
  return token ? btoa(token) : null;
};

export const decryptToken = (token) => {
  return token ? atob(token) : null;
};

// Function to decode a JWT token
export const decodeToken = (token) => {
  try {
    console.log(token);

    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


// Function to check if a token is expired
export const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return true;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};


export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken || isTokenExpired(refreshToken)) {
    console.error('Refresh token is invalid or expired.');
    return null;
  }

  console.log('refreshToken before sending refreshing access', refreshToken)

  try {
    const response = await axiosInstance.post('/token_refresh/', { refresh_token: refreshToken }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('new access token', response.data)
    if (response.status === 200) {
      const newAccessToken = response.data.accessToken;
      const encryptedNewAccessToken = encryptToken(newAccessToken)
      const RefreshToken = response.data.refreshToken;
      const encryptedRefreshToken = encryptToken(RefreshToken)

      store.dispatch(
        setAuthData({
          accessToken: encryptedNewAccessToken,
          refreshToken: encryptedRefreshToken,
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          isAuthenticated: true,
          error: null
        })
      );

      return newAccessToken;
    }

  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

