// build.js
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 项目目录
const projectDir = process.cwd()

// output 文件夹路径
const outputDir = path.join(projectDir, 'output')

// 构建命令
try {
	console.log('📦 开始 pnpm build ...')
	execSync('pnpm build', { stdio: 'inherit' })
	console.log('✅ 构建完成')
} catch (err) {
	console.error('❌ 构建失败', err)
	process.exit(1)
}

// 清空 output 文件夹
if (fs.existsSync(outputDir)) {
	console.log('🗑 清空 output 文件夹...')
	fs.rmSync(outputDir, { recursive: true, force: true })
}

// 创建 output 文件夹
fs.mkdirSync(outputDir, { recursive: true })

// 复制 .next 文件夹到 output
const nextDir = path.join(projectDir, '.next')

function copyDir(src, dest) {
	const entries = fs.readdirSync(src, { withFileTypes: true })
	entries.forEach(entry => {
		const srcPath = path.join(src, entry.name)
		const destPath = path.join(dest, entry.name)
		if (entry.isDirectory()) {
			fs.mkdirSync(destPath, { recursive: true })
			copyDir(srcPath, destPath)
		} else {
			fs.copyFileSync(srcPath, destPath)
		}
	})
}

console.log('📁 复制 .next 到 output ...')
copyDir(nextDir, outputDir)
console.log('✅ 输出完成到 output 文件夹')
