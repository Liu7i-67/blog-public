import { motion } from 'motion/react'
import { BlogPreview } from '@/components/blog-preview'
import { useWriteData } from '../hooks/use-write-data'
import type { PublishForm } from '../types'

type WritePreviewProps = {
	form: PublishForm
	coverPreviewUrl: string | null
	slug?: string
}

export function WritePreviewLive({ form, coverPreviewUrl, slug }: WritePreviewProps) {
	const previewData = useWriteData()
	return (
		<div onClick={e => e.stopPropagation()} className='-mt-28 flex-1 overflow-y-auto'>
			<BlogPreview
				markdown={previewData.markdown}
				title={previewData.title}
				tags={form.tags}
				date={previewData.date}
				summary={form.summary}
				cover={coverPreviewUrl || undefined}
				slug={slug}
			/>
		</div>
	)
}
