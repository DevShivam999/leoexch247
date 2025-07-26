import { createSlice } from "@reduxjs/toolkit";
import type { Permission } from "../types/vite-env";
import { fetchUserPermissions } from "../api/fetchUserPermissions";

interface PermissionState {
  permissions: Permission | null;
  transactionPassword:number,
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  permissions: null,
  transactionPassword:0,
  loading: false,
  error: null,
};

const PermissionSlice = createSlice({
  name: "Permission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.permissions;
        state.transactionPassword = action.payload.transactionPassword;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default PermissionSlice.reducer;
