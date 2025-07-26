import { useDispatch } from "react-redux";
import type { AppDispatch } from "../helper/store";
import { type TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../helper/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const useAppDispatch: () => AppDispatch = useDispatch;
export default useAppDispatch;
