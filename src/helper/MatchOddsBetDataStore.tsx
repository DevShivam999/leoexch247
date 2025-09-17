import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Replace with your actual data type
interface OddsData {
  maxBet:number,
  minBet:number
}

interface MatchOddsState {
  MatchOdds: Map<string, OddsData>;
  BookMaker: Map<string, OddsData>;
}

const initialState: MatchOddsState = {
  MatchOdds: new Map<string, OddsData>(),
  BookMaker: new Map<string, OddsData>(),
};

const MatchOdds = createSlice({
  name: "MatchOddsBet",
  initialState,
  reducers: {
    getMatchOddsData: (
      state,
      action: PayloadAction<{ data: Map<string, OddsData> }>
    ) => {
      state.MatchOdds = action.payload.data;
    },
 
    getBookmakerData: (
      state,
      action: PayloadAction<{ data: Map<string, OddsData> }>
    ) => {
      state.BookMaker = action.payload.data;
    },
  },
});

export const { getMatchOddsData,getBookmakerData } = MatchOdds.actions;
export default MatchOdds.reducer;
