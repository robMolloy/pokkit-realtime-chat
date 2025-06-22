import { create } from "zustand";
import { TMessageRecord } from "./dbMessageRecordsUtils";

type TState = TMessageRecord[];

export const useMessageRecordsStore = create<{
  data: TState;
  setData: (x: TState) => void;
  clear: () => void;
}>()((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: [] })),
}));
