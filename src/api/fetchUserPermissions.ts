import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../services/AxiosInstance";

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
