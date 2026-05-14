import type { StateCreator } from "zustand";

export interface BlogDraft {
  title: string;
  description: string;
  content: string;
  category: string;
  featureImage: File | null;
  featureImagePreview: string;
  aiSuggestion: string;
}

export interface BlogSlice {
  draft: BlogDraft;
  setDraftField: <K extends keyof BlogDraft>(
    key: K,
    value: BlogDraft[K],
  ) => void;
  acceptSuggestion: () => void;
  rejectSuggestion: () => void;
  clearSuggestion: () => void;
  resetDraft: () => void;
}

const initialDraft: BlogDraft = {
  title: "",
  description: "",
  content: "",
  category: "",
  featureImage: null,
  featureImagePreview: "",
  aiSuggestion: "",
};

export const createBlogSlice: StateCreator<BlogSlice> = (set) => ({
  draft: initialDraft,

  setDraftField: (key, value) =>
    set((state) => ({
      draft: {
        ...state.draft,
        [key]: value,
      },
    })),

  acceptSuggestion: () =>
    set((state) => ({
      draft: {
        ...state.draft,
        content: state.draft.aiSuggestion
          ? `${state.draft.content}\n\n${state.draft.aiSuggestion}`.trim()
          : state.draft.content,
        aiSuggestion: "",
      },
    })),

  rejectSuggestion: () =>
    set((state) => ({
      draft: {
        ...state.draft,
        aiSuggestion: "",
      },
    })),

  clearSuggestion: () =>
    set((state) => ({
      draft: {
        ...state.draft,
        aiSuggestion: "",
      },
    })),

  resetDraft: () =>
    set({
      draft: initialDraft,
    }),
});
