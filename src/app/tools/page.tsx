'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ANIMATION_DELAY, INIT_DELAY } from '@/consts'
import { useSize } from '@/hooks/use-size'

interface Tool {
	name: string
	year: number
	description: string
	href: string
	emoji: string
	tags: string[]
}

const tools: Tool[] = [
	{
		name: '图片压缩',
		year: 2025,
		description: '在浏览器本地将 PNG / JPG 等图片转换为 WEBP，支持质量调节、最大宽度限制、批量转换与一键下载。',
		href: '/image-toolbox',
		emoji: '🖼️',
		tags: ['图片', 'WEBP', '本地处理']
	},
	{
		name: '洛克王国世界属性克制表',
		year: 2026,
		description: '用于计算洛克王国世界属性的克制值。',
		href: '/tools/rocom-attr',
		emoji: '⚔️',
		tags: ['洛克王国', '属性克制']
	},
	{
		name: '优秀博客',
		year: 2025,
		description: '一些优秀的博客',
		href: '/bloggers',
		emoji: '📝',
		tags: ['博客', '分享']
	}
]

export default function Page() {
	const { maxSM } = useSize()

	return (
		<div className='flex flex-col items-center justify-center px-6 pt-32 pb-12'>
			<div className='grid w-full max-w-[1200px] grid-cols-2 gap-6 max-md:grid-cols-1'>
				{tools.map((tool, index) => (
					<motion.div
						key={tool.href}
						initial={{ opacity: 0, scale: 0.9 }}
						{...(maxSM ? { animate: { opacity: 1, scale: 1 } } : { whileInView: { opacity: 1, scale: 1 } })}
						transition={{ delay: INIT_DELAY + index * ANIMATION_DELAY }}
						className='card relative flex flex-col gap-4'>
						<div className='flex items-start gap-4'>
							<div className='bg-brand/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl'>{tool.emoji}</div>
							<div className='flex-1'>
								<div className='flex items-center gap-2'>
									<h3 className='text-lg font-semibold'>{tool.name}</h3>
									<span className='text-secondary text-sm'>{tool.year}</span>
								</div>
								<div className='mt-2 flex flex-wrap gap-2'>
									{tool.tags.map(tag => (
										<span key={tag} className='text-secondary bg-card rounded-lg px-2 py-1 text-xs'>
											{tag}
										</span>
									))}
								</div>
							</div>
						</div>

						<p className='text-secondary text-sm leading-relaxed'>{tool.description}</p>

						<div className='flex flex-wrap gap-2'>
							<Link href={tool.href} className='bg-card hover:bg-bg rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors'>
								打开工具
							</Link>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}
