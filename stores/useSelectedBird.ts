import { Bird } from "@/types/bird";
import { create } from "zustand";

type SelectedBirdStore = {
    selectedBird: Bird | null,
    setSelectedBird: (bird: Bird | null) => void;
    clearSelectedBird: () => void;
}

// Store to contain the bird that is to highlight/select in the bird list
export const useSelectedBird = create<SelectedBirdStore>((set) => ({
    selectedBird: null,
    setSelectedBird: (bird) => set({ selectedBird: bird }),
    clearSelectedBird: () => set({ selectedBird: null })
}));