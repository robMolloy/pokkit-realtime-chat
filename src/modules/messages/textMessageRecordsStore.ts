import { create } from "zustand";
import { TTextMessageRecord } from "./textMessageRecordsDbUtils";

type TState = TTextMessageRecord[];

export const useTextMessageRecordsStore = create<{
  data: TState;
  setData: (x: TState) => void;
  clear: () => void;
}>()((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: [] })),
}));
