import axios, { AxiosInstance } from "axios";

const API_BASE_URL: string = "http://localhost:8000/api/v1/";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-type": "application/json",
    // Authorization header will be added per-request where needed
  },
  timeout: 10000,
});

// Request interceptor to add the JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const tokenKey = "accessToken";
    const token = localStorage.getItem(tokenKey);

    console.log(
      `Axios Interceptor: Retrieved token with key '${tokenKey}':`,
      token,
    );

    if (token) {
      let cleanToken = token;
      if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
        console.warn(
          "Axios Interceptor: Token from localStorage has extra quotes! Trimming.",
        );
        cleanToken = cleanToken.substring(1, cleanToken.length - 1);
      }
      config.headers.Authorization = `Bearer ${cleanToken}`;
    } else {
      console.log("Axios Interceptor: No token found in localStorage.");
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor (e.g., for handling token refresh or global errors)
apiClient.interceptors.response.use(
  (response) => {
    // Any 2xx range code is considered a success
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, logging out or refreshing token...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
