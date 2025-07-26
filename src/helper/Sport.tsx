import { createSlice } from "@reduxjs/toolkit";
import type { SportType } from "../types/vite-env";

const initialState: { sport: SportType[] } = {
  sport: [
    // {
    //   comp_name: "greyhound",
    //   matches: [],
    // },

    // {
    //   comp_name: "horse",
    //   matches: [],
    // },
    {
      comp_name: "football",
      eventData: [],
    },
    {
      comp_name: "tennis",
      eventData: [],
    },
    {
      comp_name: "cricket",
      eventData: [],
    },
  ],
};
const mergeSports = (prev: SportType[], data: SportType[]) => {
  const updatedList = [...prev];

  data.forEach((incoming) => {
    const index = updatedList.findIndex(
      (s) => s.comp_name === incoming.comp_name
    );
    if (index !== -1) {
      updatedList[index] = incoming;
    } else {
      updatedList.push(incoming);
    }
  });

  return updatedList;
};
const Sport = createSlice({
  name: "Sport",
  initialState,
  reducers: {
    getSport: (state, payload) => {
      state.sport = mergeSports(state.sport, payload.payload.sport);
    },
  },
});

export const { getSport } = Sport.actions;

export default Sport.reducer;
