import { create } from 'zustand'

type PreviewStore = {
	isPreview: boolean
	isPreviewLive: boolean
	openPreview: () => void
	openPreviewLive: () => void
	closePreviewLive: () => void
	closePreview: () => void
	togglePreview: () => void
}

export const usePreviewStore = create<PreviewStore>(set => ({
	isPreview: false,
	isPreviewLive: false,
	openPreview: () => set({ isPreview: true, isPreviewLive: false }),
	openPreviewLive: () => set({ isPreviewLive: true, isPreview: false }),
	closePreviewLive: () => set({ isPreviewLive: false }),
	closePreview: () => set({ isPreview: false }),
	togglePreview: () => set(state => ({ isPreview: !state.isPreview }))
}))
