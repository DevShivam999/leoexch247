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
  (error) => Promise.reject(error)
);

instance.interceptors.request.use((cfg) => {
  const full = new URL(cfg.url ?? "", cfg.baseURL ?? window.location.origin);
  if (cfg.params)
    Object.entries(cfg.params).forEach(([k, v]) =>
      full.searchParams.set(k, String(v))
    );
  console.log("[AXIOS-REQ]", cfg.method?.toUpperCase(), full.toString());
  return cfg;
});
instance.interceptors.response.use(
  (res) => {
    console.log("[AXIOS-RES]", res.status, res.config.url);
    return res;
  },
  (err) => {
    console.log(
      "[AXIOS-ERR]",
      err?.response?.status,
      err?.config?.url,
      err?.message
    );
    return Promise.reject(err);
  }
);

export default instance;
