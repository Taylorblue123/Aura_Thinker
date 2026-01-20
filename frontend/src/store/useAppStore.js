import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // User State
        user: null,
        isAuthenticated: false,

        // Session State
        currentSession: null,
        sessions: [],
        sessionStatus: 'idle', // idle, creating, analyzing, questioning, drafting, complete

        // Questions & Responses
        questions: [],
        responses: {},
        currentQuestionIndex: 0,

        // Draft State
        currentDraft: null,
        drafts: [],
        autoSaveStatus: 'idle', // idle, saving, saved, error

        // Platform Adaptations
        adaptations: {},

        // Loading States
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),

        logout: () => set({
          user: null,
          isAuthenticated: false,
          currentSession: null,
          sessions: [],
          questions: [],
          responses: {},
          currentDraft: null,
          drafts: [],
        }),

        setCurrentSession: (session) => set({
          currentSession: session,
          sessionStatus: session?.status || 'idle'
        }),

        addSession: (session) => set((state) => ({
          sessions: [session, ...state.sessions],
          currentSession: session
        })),

        updateSessionStatus: (status) => set({ sessionStatus: status }),

        setQuestions: (questions) => set({ questions }),

        addResponse: (questionId, response) => set((state) => ({
          responses: { ...state.responses, [questionId]: response }
        })),

        setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

        nextQuestion: () => set((state) => ({
          currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
        })),

        setCurrentDraft: (draft) => set({ currentDraft: draft }),

        updateDraft: (updates) => set((state) => ({
          currentDraft: { ...state.currentDraft, ...updates }
        })),

        setAutoSaveStatus: (status) => set({ autoSaveStatus: status }),

        setAdaptation: (platform, content) => set((state) => ({
          adaptations: { ...state.adaptations, [platform]: content }
        })),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        clearError: () => set({ error: null }),

        // Helper getters
        getCurrentQuestion: () => {
          const state = get()
          return state.questions[state.currentQuestionIndex]
        },

        getAllResponses: () => {
          const state = get()
          return state.responses
        },

        hasCompletedQuestions: () => {
          const state = get()
          return Object.keys(state.responses).length >= state.questions.length
        },

        reset: () => set({
          currentSession: null,
          sessionStatus: 'idle',
          questions: [],
          responses: {},
          currentQuestionIndex: 0,
          currentDraft: null,
          adaptations: {},
          error: null
        })
      }),
      {
        name: 'aura-thinker-storage',
        partialize: (state) => ({
          user: state.user,
          sessions: state.sessions,
          currentSession: state.currentSession,
          currentDraft: state.currentDraft
        })
      }
    ),
    {
      name: 'AuraThinkerStore'
    }
  )
)

export default useAppStore