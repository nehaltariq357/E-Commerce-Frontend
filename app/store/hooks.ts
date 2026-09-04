import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { TypedUseSelectorHook } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>(); // for components use
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // for components use
