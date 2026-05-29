import { create } from "zustand";

type ResumeState = {
  summarizedText: string;
  setSummarizedText: (text: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
};

export const useResumeStore = create<ResumeState>((set) => ({
  summarizedText: "",
  setSummarizedText: (text) => set({ summarizedText: text }),
  fullName: "",
  setFullName: (name) => set({ fullName: name }),
}));

export const inputStyle = "cm-input";
export const textAreaStyle = "cm-textarea";
export const staticTextAreaStyle = "cm-pre";
