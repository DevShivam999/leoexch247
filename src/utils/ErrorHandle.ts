import axios from "axios";
import { removeUser } from "../helper/Changes";
import { setLocation } from "./setLocation";
import type { NavigateFunction } from "react-router-dom";
import type { Dispatch } from "@reduxjs/toolkit";

interface ErrorHandlerParams {
  err: any;
  setError?:  (value: React.SetStateAction<string | null>) => void;
 
  dispatch?: Dispatch;
  navigation?: NavigateFunction;
  pathname?: string;
}

export default function ErrorHandler({
  err,
  setError,
  dispatch,
  navigation,
  pathname,
}: ErrorHandlerParams) {
  console.error("API Error:", err);

  let message = "An unknown error occurred";

  if (axios.isAxiosError(err) && err.response) {
    if (err.response.status === 401 && dispatch && navigation && pathname) {
      dispatch(removeUser());
      setLocation(pathname);
      navigation("/login");
    }

    message = err.response.data.message || message;
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  setError?.(message);


}
