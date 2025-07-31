
import { createSlice } from "@reduxjs/toolkit";
import { fetchBetsResult } from "../api/fetchUserPermissions";

import type { MatchSession, Sessions } from "../types/vite-env";




const initialState:{MatchSession:MatchSession[],Session:Sessions[],name:string,loading:boolean,error:null|string}  = {
  MatchSession:[],
  Session:[],
  name:"",
  loading: false,
  error: null,
};

const ResultSlice = createSlice({
  name: "Result",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBetsResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBetsResult.fulfilled, (state, action) => {
        state.loading = false;
        state.MatchSession = action.payload.sessionMatch || [];
        state.Session=action.payload.matches
        state.name=action.payload.name
      })
      .addCase(fetchBetsResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to load Results";
      });
  },
});

export default ResultSlice.reducer;