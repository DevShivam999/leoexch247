import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../services/AxiosInstance";
import type { IBanner } from "../types/vite-env";

export const fetchUserPermissions = createAsyncThunk(
  "auth/fetchUserPermissions",
  async (_, thunkAPI) => {
    try {
      const res = await instance.get("user/me");
      const permissions = res.data.permissions;
      const tp=res.data.transactionPassword;
      return {
        permissions,
        transactionPassword: tp,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch permissions",
      );
    }
  },
);
export const fetchBanner = createAsyncThunk(
  "Banner/fetchBanner",
  async (_, thunkAPI) => {
    try {
      
          const response = await instance.post<IBanner[]>("/user/show_banner",{type: "bannerA"})
      return {data:response.data}
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch permissions",
      );
    }
  },
);
export const fetchBetsResult = createAsyncThunk(
  "Results/fetchBetsResult",
  async (id:string, thunkAPI) => {
    try {
      
            const [result, match] = await Promise.all([
        instance.get(`betting/resultmarketmatch?matchId=${id}`),
        instance.get(`betting/match-session?matchId=${id}&search=`),
      ]);

      return {sessionMatch:[...result.data.marketTypes,...result.data.bookmarketTypes],matches:match.data.results,name:result.data.name}
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch permissions",
      );
    }
  },
);
