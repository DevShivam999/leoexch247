// store.tsx
import { configureStore } from "@reduxjs/toolkit";
import changeStore from "./Changes";
import socket from "./SokcetStore";
import permissionReducer from "./Permissions";
import Sport from "./Sport";
import FancyBetData from "./FancyBetData";
import BannerStore from "./BannerStore";
import BetsResult from "./BetsResult";


const rootReducer = {
  Sport,
  changeStore,
  BannerStore,
  socket,
  BetsResult,
  FancyBetData,
  Permissions: permissionReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;