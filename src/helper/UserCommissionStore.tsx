import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CommissionState {
  matchOddsCommission: string;
  bookmakerCommission: string;
  fancyCommission: string;
  matchOddsTypeCommission: string;
  bookmakerTypeCommission: string;
  fancyTypeCommission: string;
}

const initialState: CommissionState = {
  matchOddsCommission: "0",
  bookmakerCommission: "0",
  fancyCommission: "0",
  matchOddsTypeCommission: "All",
  bookmakerTypeCommission: "All",
  fancyTypeCommission: "All",
};

const UserCommissionSlice = createSlice({
  name: "UserCommission",
  initialState,
  reducers: {
    MatchOddsCommission(state, action: PayloadAction<string>) {
      state.matchOddsCommission = action.payload;
    },
    BookmakerCommission(state, action: PayloadAction<string>) {
      state.bookmakerCommission = action.payload;
    },
    FancyCommission(state, action: PayloadAction<string>) {
      state.fancyCommission = action.payload;
    },
    MatchOddsTypeCommission(state, action: PayloadAction<string>) {
      state.matchOddsTypeCommission = action.payload;
    },
    BookmakerTypeCommission(state, action: PayloadAction<string>) {
      state.bookmakerTypeCommission = action.payload;
    },
    FancyTypeCommission(state, action: PayloadAction<string>) {
      state.fancyTypeCommission = action.payload;
    },
    AllClear(state) {
      ((state.matchOddsCommission = "0"),
        (state.bookmakerCommission = "0"),
        (state.fancyCommission = "0"),
        (state.matchOddsTypeCommission = "All"),
        (state.bookmakerTypeCommission = "All"),
        (state.fancyTypeCommission = "All"));
    },
  },
});

export const {
  MatchOddsCommission,
  BookmakerCommission,
  FancyCommission,
  MatchOddsTypeCommission,
  BookmakerTypeCommission,
  FancyTypeCommission,
  AllClear
} = UserCommissionSlice.actions;

export default UserCommissionSlice.reducer;
