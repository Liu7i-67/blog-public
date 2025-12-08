import React, { useState } from 'react'

interface Props {
	insertText: (text: string) => void
}

/** 颜色选择弹窗组件（复用） */
function ColorPicker({ label, onSelect }: { label: string; onSelect: (color: string) => void }) {
	const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#5352ed', '#000000']

	return (
		<div className='absolute top-full left-0 z-10 mt-1 w-max rounded border bg-white p-2 shadow'>
			<div className='mb-1 text-xs text-gray-700'>{label}</div>

			{/* 快捷颜色 */}
			<div className='mb-2 flex gap-1'>
				{colors.map(c => (
					<div key={c} className='h-5 w-5 cursor-pointer rounded border' style={{ background: c }} onClick={() => onSelect(c)} />
				))}
			</div>

			{/* 自定义颜色 */}
			<input type='color' className='h-7 w-12 cursor-pointer rounded border p-0' onChange={e => onSelect(e.target.value)} />
		</div>
	)
}

export function MarkdownToolbar({ insertText }: Props) {
	const [expanded, setExpanded] = useState(false)

	/** 基础 SVG 图标 */
	const Icon = {
		bold: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<path d='M7 4h6a4 4 0 010 8H7V4zm0 8h7a4 4 0 010 8H7v-8z' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		italic: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<line x1='12' y1='4' x2='12' y2='20' stroke='currentColor' strokeWidth='2' />
				<line x1='7' y1='4' x2='17' y2='4' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		code: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<polyline points='7 8 3 12 7 16' stroke='currentColor' strokeWidth='2' />
				<polyline points='17 8 21 12 17 16' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		codeBlock: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<rect x='3' y='5' width='18' height='14' rx='2' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		quote: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<path d='M7 7h5v5H9l-2 3v-8z' fill='currentColor' />
				<path d='M15 7h5v5h-3l-2 3v-8z' fill='currentColor' />
			</svg>
		),
		list: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<circle cx='5' cy='7' r='1.5' fill='currentColor' />
				<circle cx='5' cy='12' r='1.5' fill='currentColor' />
				<circle cx='5' cy='17' r='1.5' fill='currentColor' />
				<line x1='9' y1='7' x2='21' y2='7' stroke='currentColor' strokeWidth='2' />
				<line x1='9' y1='12' x2='21' y2='12' stroke='currentColor' strokeWidth='2' />
				<line x1='9' y1='17' x2='21' y2='17' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		image: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<rect x='3' y='5' width='18' height='14' rx='2' stroke='currentColor' strokeWidth='2' />
				<circle cx='8' cy='10' r='2' fill='currentColor' />
				<path d='M21 17l-6-6-4 4-2-2-5 5' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		link: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<path d='M10 14l-1 1a4 4 0 01-6-6l3-3a4 4 0 016 0' stroke='currentColor' strokeWidth='2' />
				<path d='M14 10l1-1a4 4 0 016 6l-3 3a4 4 0 01-6 0' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		heading: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<path d='M6 4v16M18 4v16M6 12h12' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		expand: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<polyline points='6 9 12 15 18 9' stroke='currentColor' strokeWidth='2' />
			</svg>
		),
		collapse: (
			<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
				<polyline points='6 15 12 9 18 15' stroke='currentColor' strokeWidth='2' />
			</svg>
		)
	}

	/** 按钮项配置 */
	const baseItems = [
		{ label: '加粗', icon: Icon.bold, action: () => insertText('**bold**') },
		{ label: '斜体', icon: Icon.italic, action: () => insertText('*italic*') },
		{ label: '行内代码', icon: Icon.code, action: () => insertText('`code`') },
		{ label: '代码块', icon: Icon.codeBlock, action: () => insertText('```\ncode block\n```') },
		{
			label: '颜色文本',
			icon: (
				<svg width='16' height='16' viewBox='0 0 24 24'>
					<text x='12' y='14' textAnchor='middle' fontSize='16' fontWeight='bold' fill='currentColor'>
						T
					</text>
					<rect x='6' y='17' width='12' height='3' rx='1' fill='currentColor' />
				</svg>
			),
			custom: true,
			render: ({ open, setOpen }: any) => (
				<div className='relative'>
					<button className='hover:bg-accent flex items-center justify-center rounded border px-2 py-1 transition' onClick={() => setOpen(!open)}>
						{/* icon */}
						<svg width='16' height='16' viewBox='0 0 24 24'>
							<text x='12' y='14' textAnchor='middle' fontSize='16' fontWeight='bold' fill='currentColor'>
								T
							</text>
							<rect x='6' y='17' width='12' height='3' rx='1' fill='currentColor' />
						</svg>
					</button>

					{/* 颜色面板 */}
					{open && (
						<ColorPicker
							label='选择文本颜色'
							onSelect={c => {
								insertText(`<span style="color:${c}">text</span>`)
								setOpen(false)
							}}
						/>
					)}
				</div>
			)
		},
		{
			label: '背景色文本',
			icon: (
				<svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
					{/* 正方形背景 */}
					<rect x='4' y='4' width='12' height='12' rx='2' fill='#E5E5E5' />

					{/* 字母 A */}
					<text x='10' y='13' textAnchor='middle' fontSize='10' fontWeight='bold' fill='#000'>
						A
					</text>
				</svg>
			),
			custom: true,
			render: ({ open, setOpen }: any) => (
				<div className='relative'>
					<button className='hover:bg-accent flex items-center justify-center rounded border px-2 py-1 transition' onClick={() => setOpen(!open)}>
						<svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
							<rect x='4' y='4' width='12' height='12' rx='2' fill='#E5E5E5' />
							<text x='10' y='13' textAnchor='middle' fontSize='10' fontWeight='bold' fill='#000'>
								A
							</text>
						</svg>
					</button>

					{open && (
						<ColorPicker
							label='选择背景色'
							onSelect={c => {
								insertText(`<span style="background:${c}">text</span>`)
								setOpen(false)
							}}
						/>
					)}
				</div>
			)
		},
		{ label: '引用', icon: Icon.quote, action: () => insertText('> 引用') },
		{ label: '无序列表', icon: Icon.list, action: () => insertText('- 列表项') },
		{ label: '图片', icon: Icon.image, action: () => insertText('![alt](url)') },
		{ label: '链接', icon: Icon.link, action: () => insertText('[文本](url)') },
		{
			label: '删除线',
			icon: (
				<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
					<text x='12' y='24' textAnchor='middle' fontSize='24' fontWeight='bold' fill='#000'>
						A
					</text>
					<line x1='0' y1='20' x2='24' y2='20' stroke='currentColor' strokeWidth='2' />
				</svg>
			),
			action: () => insertText(`~~text~~`)
		},
		{
			label: '下划线',
			icon: (
				<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
					<text x='12' y='20' textAnchor='middle' fontSize='20' fontWeight='bold' fill='#000'>
						A
					</text>
					<line x1='0' y1='24' x2='24' y2='24' stroke='currentColor' strokeWidth='2' />
				</svg>
			),
			action: () => insertText(`<u>text</u>`)
		},
		{
			label: '表格',
			icon: (
				<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
					<rect x='3' y='4' width='18' height='16' rx='2' stroke='currentColor' strokeWidth='2' />
					<line x1='3' y1='10' x2='21' y2='10' stroke='currentColor' strokeWidth='2' />
					<line x1='12' y1='4' x2='12' y2='20' stroke='currentColor' strokeWidth='2' />
				</svg>
			),
			action: () => insertText(`| 列1 | 列2 |\n| --- | --- |\n| 内容1 | 内容2 |`)
		}
	]

	const moreItems = [{ label: '标题', icon: Icon.heading, action: () => insertText('# 标题') }]

	const renderButton = (item: any) => {
		if (item.custom) {
			const [open, setOpen] = useState(false)
			return (
				<div className='group relative' key={item.label}>
					{item.render({ open, setOpen })}

					<div className='pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100'>
						{item.label}
					</div>
				</div>
			)
		}

		return (
			<div className='group relative' key={item.label}>
				<button className='hover:bg-accent flex items-center justify-center rounded border px-2 py-1 transition' onClick={item.action}>
					{item.icon}
				</button>

				{/* tooltip */}
				<div className='pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100'>
					{item.label}
				</div>
			</div>
		)
	}

	return (
		<div className='mb-3'>
			{/* 第一行（常用工具） */}
			<div className='flex flex-wrap gap-2'>
				{baseItems.map(item => renderButton(item))}

				{/* 展开/折叠按钮 */}
				<div className='group relative'>
					<button className='hover:bg-accent flex items-center justify-center rounded border px-2 py-1 transition' onClick={() => setExpanded(!expanded)}>
						{expanded ? Icon.collapse : Icon.expand}
					</button>
					<div className='pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100'>
						{expanded ? '收起' : '展开'}
					</div>
				</div>
			</div>

			{/* 第二行（不常用，折叠） */}
			{expanded && <div className='mt-2 flex flex-wrap gap-2'>{moreItems.map(item => renderButton(item))}</div>}
		</div>
	)
}
