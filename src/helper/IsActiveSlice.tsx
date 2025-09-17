// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


type UiState = { isActive: boolean };

const initialState: UiState = { isActive: true }; // your old useState default

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsActive(state, action: PayloadAction<boolean>) {
      state.isActive = action.payload;
    },
    toggleIsActive(state) {
      state.isActive = !state.isActive;
    },
  },
});

export const { setIsActive, toggleIsActive } = uiSlice.actions;
export default uiSlice.reducer;

// (optional) typed selector
// export const selectIsActive = (state: RootState) => state.ui.isActive;
