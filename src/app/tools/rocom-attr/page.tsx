'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ANIMATION_DELAY, INIT_DELAY } from '@/consts'

const COMPACT_BREAKPOINT = 1350

// --- 类型定义 ---
type ElementType = string

interface TypeDef {
	attr: ElementType
	def50: ElementType[]
	def200: ElementType[]
	atk50: ElementType[]
	atk200: ElementType[]
}

type TypeDataMap = Record<ElementType, TypeDef>

interface CellPosition {
	row: ElementType
	col: ElementType
}

// --- 原始属性数据 ---
const TYPE_DATA: TypeDataMap = {
	普通: { attr: '普通', def50: ['幽'], def200: ['武'], atk50: ['地', '幽', '机械'], atk200: [] },
	草: {
		attr: '草',
		def50: ['水', '光', '地', '电'],
		def200: ['火', '冰', '毒', '虫', '翼'],
		atk50: ['火', '龙', '毒', '虫', '翼', '机械'],
		atk200: ['水', '光', '地']
	},
	火: { attr: '火', def50: ['草', '冰', '虫', '萌', '机械'], def200: ['水', '地'], atk50: ['水', '地', '龙'], atk200: ['草', '冰', '虫', '机械'] },
	水: { attr: '水', def50: ['火', '机械'], def200: ['草', '电'], atk50: ['草', '冰', '龙'], atk200: ['火', '地', '机械'] },
	光: { attr: '光', def50: ['恶', '幻'], def200: ['草', '幽'], atk50: ['草', '冰'], atk200: ['幽', '恶'] },
	地: { attr: '地', def50: ['普通', '火', '电', '毒', '翼'], def200: ['草', '水', '冰', '武', '机械'], atk50: ['草', '武'], atk200: ['火', '冰', '电', '毒'] },
	冰: { attr: '冰', def50: ['水', '光', '冰'], def200: ['火', '地', '武', '机械'], atk50: ['火', '冰', '机械'], atk200: ['草', '地', '翼', '恶'] },
	龙: { attr: '龙', def50: ['草', '火', '水', '电', '翼'], def200: ['冰', '龙', '萌'], atk50: ['机械'], atk200: ['龙'] },
	电: { attr: '电', def50: ['电', '翼', '机械'], def200: ['地'], atk50: ['草', '地', '龙', '电'], atk200: ['水', '翼'] },
	毒: { attr: '毒', def50: ['草', '毒', '虫', '武', '萌'], def200: ['地', '恶', '幻'], atk50: ['地', '毒', '幽', '机械'], atk200: ['草', '萌'] },
	虫: { attr: '虫', def50: ['草', '武'], def200: ['火', '翼'], atk50: ['火', '毒', '武', '翼', '萌', '幽', '机械'], atk200: ['草', '恶', '幻'] },
	武: {
		attr: '武',
		def50: ['地', '虫', '恶'],
		def200: ['翼', '萌', '幻'],
		atk50: ['毒', '虫', '翼', '萌', '幽', '幻'],
		atk200: ['普通', '地', '冰', '恶', '机械']
	},
	翼: { attr: '翼', def50: ['草', '虫', '武'], def200: ['冰', '电'], atk50: ['地', '龙', '电', '机械'], atk200: ['草', '虫', '武'] },
	萌: { attr: '萌', def50: ['虫', '武'], def200: ['毒', '恶', '机械'], atk50: ['火', '毒', '机械'], atk200: ['龙', '武', '恶'] },
	幽: { attr: '幽', def50: ['普通', '毒', '虫', '武'], def200: ['光', '幽', '恶'], atk50: ['普通', '恶'], atk200: ['光', '幽', '幻'] },
	恶: { attr: '恶', def50: ['幽', '恶'], def200: ['光', '虫', '武', '萌'], atk50: ['光', '武', '恶'], atk200: ['毒', '萌', '幽'] },
	机械: {
		attr: '机械',
		def50: ['普通', '草', '冰', '龙', '毒', '虫', '翼', '萌', '机械', '幻'],
		def200: ['火', '水', '武'],
		atk50: ['火', '水', '电', '机械'],
		atk200: ['地', '冰', '萌']
	},
	幻: { attr: '幻', def50: ['武', '幻'], def200: ['虫', '幽'], atk50: ['光', '机械', '幻'], atk200: ['毒', '武'] }
}

const TYPES: ElementType[] = Object.keys(TYPE_DATA)

const ATTR_ICON = (type: ElementType) => `/images/rocom/${type}.png`

// 属性图标 + 名称（用于表头）
function AttrLabel({ type, size = 28, vertical = false }: { type: ElementType; size?: number; vertical?: boolean }) {
	return (
		<div className={vertical ? 'flex flex-col items-center gap-1' : 'flex items-center gap-1.5'}>
			<img src={ATTR_ICON(type)} alt={type} width={size} height={size} className='shrink-0 drop-shadow-sm' style={{ width: size, height: size }} />
			<span className='text-xs font-medium'>{type}</span>
		</div>
	)
}

export default function App() {
	const [secondaryDef, setSecondaryDef] = useState<ElementType | null>(null)
	const [hoveredCell, setHoveredCell] = useState<CellPosition | null>(null)
	const [defenders, setDefenders] = useState<ElementType[]>([])
	const [isCompact, setIsCompact] = useState(false)

	useEffect(() => {
		const check = () => setIsCompact(window.innerWidth < COMPACT_BREAKPOINT)
		check()
		window.addEventListener('resize', check)
		return () => window.removeEventListener('resize', check)
	}, [])

	const getSingleDamage = (attacker: ElementType, defender: ElementType): number => {
		const atkData = TYPE_DATA[attacker]
		if (atkData.atk200.includes(defender)) return 2
		if (atkData.atk50.includes(defender)) return 0.5
		return 1
	}

	const getDamage = (attacker: ElementType, def1: ElementType, def2: ElementType | null): number => {
		const m1 = getSingleDamage(attacker, def1)
		if (!def2 || def1 === def2) return m1
		const m2 = getSingleDamage(attacker, def2)
		if (m1 === 2 && m2 === 2) return 3
		if ((m1 === 2 && m2 === 0.5) || (m1 === 0.5 && m2 === 2)) return 1
		if (m1 === 0.5 && m2 === 0.5) return 0.25
		if (m1 === 1) return m2
		if (m2 === 1) return m1
		return m1 * m2
	}

	// 浅色风格的倍率配色
	const getCellStyle = (val: number): string => {
		if (val === 3) return 'bg-gradient-to-br from-rose-400 to-rose-500 text-white font-bold shadow-[0_2px_10px_rgba(244,63,94,0.35)]'
		if (val === 2) return 'bg-gradient-to-br from-orange-300 to-orange-400 text-white font-semibold'
		if (val === 1) return 'bg-white/50 text-secondary font-medium'
		if (val === 0.5) return 'bg-gradient-to-br from-teal-200 to-teal-300 text-teal-900 font-semibold'
		if (val === 0.25) return 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold shadow-[0_2px_10px_rgba(20,184,166,0.4)]'
		return 'bg-white/50 text-secondary'
	}

	const handleDefClick = (type: ElementType) => {
		setSecondaryDef(prev => (prev === type ? null : type))
	}

	const toggleDefender = (type: ElementType) => {
		setDefenders(prev => {
			if (prev.includes(type)) return prev.filter(t => t !== type)
			if (prev.length >= 2) return prev
			return [...prev, type]
		})
	}

	// 紧凑模式下：以当前选择的防守属性为基准，对所有进攻属性按伤害降序分组
	const groupedResults = useMemo(() => {
		if (defenders.length === 0) return []
		const def1 = defenders[0]
		const def2 = defenders[1] || null
		const map = new Map<number, ElementType[]>()
		TYPES.forEach(atk => {
			const dmg = getDamage(atk, def1, def2)
			if (!map.has(dmg)) map.set(dmg, [])
			map.get(dmg)!.push(atk)
		})
		return Array.from(map.entries())
			.map(([damage, attackers]) => ({ damage, attackers }))
			.sort((a, b) => b.damage - a.damage)
	}, [defenders])

	const legend = [
		{ val: '3x', label: '效果拔群', dot: 'bg-gradient-to-br from-rose-400 to-rose-500' },
		{ val: '2x', label: '克制', dot: 'bg-gradient-to-br from-orange-300 to-orange-400' },
		{ val: '1x', label: '正常', dot: 'bg-slate-200' },
		{ val: '0.5x', label: '抵抗', dot: 'bg-gradient-to-br from-teal-200 to-teal-300' },
		{ val: '0.25x', label: '打不动', dot: 'bg-gradient-to-br from-teal-500 to-emerald-600' }
	]

	return (
		<div className='relative min-h-screen px-6 pt-32 pb-12 max-sm:pt-28'>
			<div className='mx-auto flex max-w-[1400px] flex-col gap-6'>
				{/* 标题区 */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: INIT_DELAY }}
					className='space-y-2 text-center'>
					<p className='text-secondary text-xs tracking-[0.2em] uppercase'>Rocom Attribute Matrix</p>
					<h1 className='text-2xl font-semibold'>洛克王国世界属性克制表</h1>
					<p className='text-secondary text-sm'>{isCompact ? '勾选 1-2 个防守属性，查看所有进攻属性的伤害排名' : '点击 X 轴属性激活双防御体系，悬停查看十字高亮'}</p>
				</motion.div>

				{/* 图例 */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: INIT_DELAY + ANIMATION_DELAY }}
					className='card relative flex flex-wrap items-center justify-center gap-3'>
					{legend.map(item => (
						<div key={item.val} className='flex items-center gap-2 text-xs'>
							<span className={`h-4 w-4 rounded-md ${item.dot}`} />
							<span className='text-primary font-semibold'>{item.val}</span>
							<span className='text-secondary'>{item.label}</span>
						</div>
					))}
					{secondaryDef && !isCompact && (
						<button
							onClick={() => setSecondaryDef(null)}
							className='border-brand text-brand hover:bg-brand/10 ml-2 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition'>
							<img src={ATTR_ICON(secondaryDef)} alt={secondaryDef} className='h-4 w-4' />
							副属性 {secondaryDef} ✕
						</button>
					)}
				</motion.div>

				{/* 矩阵主体 */}
				{!isCompact ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: INIT_DELAY + ANIMATION_DELAY * 2 }}
						className='card relative overflow-hidden p-3'>
					<div className='custom-scrollbar overflow-auto' onMouseLeave={() => setHoveredCell(null)}>
						<table className='w-full border-separate border-spacing-1 text-center text-sm'>
							<thead>
								<tr>
									<th className='bg-bg/60 text-secondary sticky top-0 left-0 z-40 min-w-[88px] rounded-xl p-2 text-[10px] tracking-widest uppercase'>
										防守 →<br />
										进攻 ↓
									</th>
									{TYPES.map(def => {
										const isActive = def === secondaryDef
										const isHoveredCol = hoveredCell?.col === def
										return (
											<th
												key={def}
												onClick={() => handleDefClick(def)}
												className={`sticky top-0 z-30 min-w-[60px] cursor-pointer rounded-xl p-2 transition-all duration-200 select-none ${
													isActive
														? 'bg-linear text-white shadow-[0_4px_12px_rgba(53,191,171,0.4)]'
														: isHoveredCol
															? 'bg-brand/10 text-brand'
															: 'text-primary bg-white/60 hover:bg-white'
												}`}
												title={`点击将 [${def}] 设为副属性`}>
												<AttrLabel type={def} size={28} vertical />
											</th>
										)
									})}
								</tr>
								{secondaryDef && (
									<tr>
										<th className='bg-brand/10 text-brand sticky left-0 z-30 rounded-xl p-1 text-[10px] tracking-widest uppercase'>+ 副 {secondaryDef}</th>
										{TYPES.map(def => (
											<th
												key={`sub-${def}`}
												className={`rounded-lg p-1 text-[11px] ${def === secondaryDef ? 'bg-brand/20 text-brand font-semibold' : 'text-brand/60 bg-white/30'}`}>
												<div className='flex items-center justify-center gap-1'>
													<img src={ATTR_ICON(secondaryDef)} alt={secondaryDef} className='h-3.5 w-3.5' />
													<span>{secondaryDef}</span>
												</div>
											</th>
										))}
									</tr>
								)}
							</thead>

							<tbody>
								{TYPES.map(atk => (
									<tr key={atk} className='group'>
										<th
											className={`sticky left-0 z-20 min-w-[88px] rounded-xl p-2 transition-colors duration-200 ${
												hoveredCell?.row === atk ? 'bg-brand/10 text-brand' : 'text-primary bg-white/60'
											}`}>
											<AttrLabel type={atk} size={28} />
										</th>

										{TYPES.map(def => {
											const dmg = getDamage(atk, def, secondaryDef)

											const isHovered = hoveredCell?.row === atk && hoveredCell?.col === def
											const isAnyHovered = hoveredCell !== null
											const inCrosshair = isAnyHovered && (hoveredCell.row === atk || hoveredCell.col === def)
											const isDimmed = isAnyHovered && !inCrosshair

											return (
												<td
													key={`${atk}-${def}`}
													onMouseEnter={() => setHoveredCell({ row: atk, col: def })}
													className={`relative cursor-crosshair rounded-lg p-2 transition-all duration-200 ${getCellStyle(dmg)} ${
														isDimmed ? 'scale-95 opacity-30' : 'scale-100 opacity-100'
													} ${inCrosshair && !isHovered ? 'brightness-105 saturate-125' : ''} ${
														isHovered ? 'ring-brand/60 z-30 scale-110 text-base font-black ring-2' : ''
													}`}>
													{dmg}
												</td>
											)
										})}
									</tr>
								))}
							</tbody>
							<thead>
								{secondaryDef && (
									<tr>
										<th className='bg-brand/10 text-brand sticky left-0 z-30 rounded-xl p-1 text-[10px] tracking-widest uppercase'>+ 副 {secondaryDef}</th>
										{TYPES.map(def => (
											<th
												key={`sub-${def}`}
												className={`rounded-lg p-1 text-[11px] ${def === secondaryDef ? 'bg-brand/20 text-brand font-semibold' : 'text-brand/60 bg-white/30'}`}>
												<div className='flex items-center justify-center gap-1'>
													<img src={ATTR_ICON(secondaryDef)} alt={secondaryDef} className='h-3.5 w-3.5' />
													<span>{secondaryDef}</span>
												</div>
											</th>
										))}
									</tr>
								)}
								<tr>
									<th className='bg-bg/60 text-secondary sticky top-0 left-0 z-40 min-w-[88px] rounded-xl p-2 text-[10px] tracking-widest uppercase'>
										进攻 ↑<br />
										防守 →
									</th>
									{TYPES.map(def => {
										const isActive = def === secondaryDef
										const isHoveredCol = hoveredCell?.col === def
										return (
											<th
												key={def}
												onClick={() => handleDefClick(def)}
												className={`sticky top-0 z-30 min-w-[60px] cursor-pointer rounded-xl p-2 transition-all duration-200 select-none ${
													isActive
														? 'bg-linear text-white shadow-[0_4px_12px_rgba(53,191,171,0.4)]'
														: isHoveredCol
															? 'bg-brand/10 text-brand'
															: 'text-primary bg-white/60 hover:bg-white'
												}`}
												title={`点击将 [${def}] 设为副属性`}>
												<AttrLabel type={def} size={28} vertical />
											</th>
										)
									})}
								</tr>
							</thead>
						</table>
					</div>
				</motion.div>
				) : (
					<>
						{/* 紧凑视图：选择防守属性 */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: INIT_DELAY + ANIMATION_DELAY * 2 }}
							className='card relative'>
							<div className='mb-3 flex items-center justify-between'>
								<p className='text-secondary text-xs tracking-[0.2em] uppercase'>选择防守方（最多 2 个）</p>
								{defenders.length > 0 && (
									<button onClick={() => setDefenders([])} className='text-brand text-xs font-medium hover:underline'>
										清空
									</button>
								)}
							</div>
							<div className='grid grid-cols-6 gap-2 max-md:grid-cols-5 max-sm:grid-cols-4 max-xs:grid-cols-3'>
								{TYPES.map(type => {
									const selected = defenders.includes(type)
									const disabled = !selected && defenders.length >= 2
									return (
										<button
											key={type}
											disabled={disabled}
											onClick={() => toggleDefender(type)}
											className={`flex flex-col items-center justify-center gap-1 rounded-2xl p-2 transition-all duration-200 ${
												selected
													? 'bg-linear scale-105 text-white shadow-[0_4px_12px_rgba(53,191,171,0.4)]'
													: disabled
														? 'cursor-not-allowed bg-white/30 opacity-40'
														: 'text-primary bg-white/60 hover:bg-white hover:shadow-sm'
											}`}>
											<img
												src={ATTR_ICON(type)}
												alt={type}
												className='drop-shadow-sm'
												style={{ width: 36, height: 36 }}
											/>
											<span className='text-xs font-medium'>{type}</span>
										</button>
									)
								})}
							</div>
						</motion.div>

						{/* 紧凑视图：进攻伤害排序 */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: INIT_DELAY + ANIMATION_DELAY * 3 }}
							className='card relative'>
							{defenders.length === 0 ? (
								<div className='text-secondary flex flex-col items-center justify-center gap-2 py-12 text-center text-sm'>
									<span className='text-2xl'>⚔️</span>
									<span>请先在上方选择 1-2 个防守属性</span>
								</div>
							) : (
								<div className='space-y-3'>
									<div className='text-secondary flex flex-wrap items-center gap-2 text-xs tracking-[0.2em] uppercase'>
										<span>进攻方对</span>
										{defenders.map(d => (
											<span key={d} className='bg-brand/10 text-brand inline-flex items-center gap-1 rounded-full px-2 py-0.5 normal-case'>
												<img src={ATTR_ICON(d)} alt={d} className='h-3.5 w-3.5' />
												{d}
											</span>
										))}
										<span>的伤害（高 → 低）</span>
									</div>
									<div className='space-y-2'>
										{groupedResults.map(group => (
											<div key={group.damage} className='flex items-start gap-3 rounded-2xl bg-white/40 p-2'>
												<div
													className={`flex h-12 w-16 shrink-0 items-center justify-center rounded-xl text-sm ${getCellStyle(group.damage)}`}>
													{group.damage}x
												</div>
												<div className='flex flex-1 flex-wrap gap-1.5 pt-1'>
													{group.attackers.map(atk => (
														<div
															key={atk}
															className='text-primary flex items-center gap-1.5 rounded-full bg-white/70 px-2 py-1 text-xs'>
															<img src={ATTR_ICON(atk)} alt={atk} className='h-5 w-5' />
															<span className='font-medium'>{atk}</span>
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</motion.div>
					</>
				)}
			</div>

			<style
				dangerouslySetInnerHTML={{
					__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--color-brand) 40%, transparent);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--color-brand) 70%, transparent);
        }
      `
				}}
			/>
		</div>
	)
}
