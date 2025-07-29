// Banner.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchBanner } from "../api/fetchUserPermissions";
import type { BannerState } from "../types/vite-env";




const initialState: BannerState = {
  data: [],
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to load banners";
      });
  },
});

export default bannerSlice.reducer;