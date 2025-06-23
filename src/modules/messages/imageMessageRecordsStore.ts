import { create } from "zustand";
import { TImageMessageRecord } from "./imageMessageRecordsDbUtils";

type TState = TImageMessageRecord[];

export const useImageMessageRecordsStore = create<{
  data: TState;
  setData: (x: TState) => void;
  clear: () => void;
}>()((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: [] })),
}));
