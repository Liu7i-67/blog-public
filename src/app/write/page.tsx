'use client'

import { useWriteStore } from './stores/write-store'
import { usePreviewStore } from './stores/preview-store'
import { WriteEditor } from './components/editor'
import { WriteSidebar } from './components/sidebar'
import { WriteActions } from './components/actions'
import { WritePreview } from './components/preview'
import { useEffect } from 'react'
import { WritePreviewLive } from './components/previewLive'

export default function WritePage() {
	const { form, cover, reset } = useWriteStore()
	useEffect(() => reset(), [])
	const { isPreview, closePreview, isPreviewLive } = usePreviewStore()

	const coverPreviewUrl = cover ? (cover.type === 'url' ? cover.url : cover.previewUrl) : null

	return isPreview ? (
		<WritePreview form={form} coverPreviewUrl={coverPreviewUrl} onClose={closePreview} />
	) : (
		<>
			<div className='flex h-full justify-center gap-6 px-6 pt-24 pb-12'>
				<WriteEditor />
				{isPreviewLive && <WritePreviewLive form={form} coverPreviewUrl={coverPreviewUrl} />}
				{!isPreviewLive && <WriteSidebar />}
			</div>

			<WriteActions />
		</>
	)
}
