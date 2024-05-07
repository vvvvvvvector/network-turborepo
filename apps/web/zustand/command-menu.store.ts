import { create } from "zustand";

type State = {
  commandMenuOpened: boolean;
};

type Actions = {
  toogleCmdMenuOpenState: () => void;
  setCommandMenuOpened: (opened: boolean) => void;
};

export const useCommandMenuStore = create<State & Actions>((set) => ({
  commandMenuOpened: false,
  setCommandMenuOpened: (opened: boolean) =>
    set(() => {
      return { commandMenuOpened: opened };
    }),
  toogleCmdMenuOpenState: () =>
    set((state) => {
      return { commandMenuOpened: !state.commandMenuOpened };
    }),
}));
