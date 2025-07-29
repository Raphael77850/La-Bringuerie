import { useCallback, useEffect, useState } from "react";
import api from "../src/config/axiosConfig";

const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";

export function useAuthToken() {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  });
  const [refreshToken, setRefreshTokenState] = useState<string | null>(() => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  });

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, [refreshToken]);

  const clearTokens = useCallback(() => {
    setAccessTokenState(null);
    setRefreshTokenState(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }, []);

  const setTokens = (access: string | null, refresh: string | null) => {
    setAccessTokenState(access);
    setRefreshTokenState(refresh);
  };

  // Rafraîchir le token d'accès
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return null;
    try {
      const res = await api.post<{ accessToken?: string }>("/refresh-token", {
        refreshToken,
      });
      if (res.data?.accessToken) {
        setAccessTokenState(res.data.accessToken);
        return res.data.accessToken;
      }
    } catch (e) {
      clearTokens();
    }
    return null;
  }, [refreshToken, clearTokens]);

  return {
    accessToken,
    refreshToken,
    setTokens,
    clearTokens,
    refreshAccessToken,
  };
}
