import axios, { type AxiosInstance } from "axios";
import { store } from "../helper/store";

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_Api_Url,
});

instance.interceptors.request.use(
  (config) => {
    const { user, token } = store.getState().changeStore;

    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    if (user?._id) {
      config.headers["_id"] = user._id;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  },
);

export default instance;
