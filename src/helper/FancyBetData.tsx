import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: { Fancy:{ betAmount: number; sessionRunner: string }[] } = {
    Fancy: [],
};

const Bookmaker = createSlice({
  name: "FancyBet",
  initialState,
  reducers: {
    getFancyData: (
      state,
      action: PayloadAction<{
        data: { betAmount: number; sessionRunner: string }[];
      }>
    ) => {
      state.Fancy = action.payload.data;
    },
  },
});

export const { getFancyData } = Bookmaker.actions;
export default Bookmaker.reducer;
