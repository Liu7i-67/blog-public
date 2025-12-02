// start.js
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 项目根目录
const projectDir = process.cwd()

// output 和 .next 目录路径
const outputDir = path.join(projectDir, 'output')
const nextDir = path.join(projectDir, '.next')

// 工具函数：复制目录
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

// 1️⃣ 停止 PM2 当前服务
try {
	console.log('🛑 停止 my-next 服务（如果存在）...')
	execSync('pm2 delete my-next', { stdio: 'inherit' })
} catch (err) {
	console.log('⚠️ my-next 服务不存在或已停止')
}

// 2️⃣ 清空 .next 目录
if (fs.existsSync(nextDir)) {
	console.log('🗑 清空 .next 目录...')
	fs.rmSync(nextDir, { recursive: true, force: true })
}

// 3️⃣ 将 output 内容复制到 .next
if (!fs.existsSync(outputDir)) {
	console.error('❌ output 目录不存在，请先 build 项目')
	process.exit(1)
}

console.log('📁 复制 output 到 .next ...')
fs.mkdirSync(nextDir, { recursive: true })
copyDir(outputDir, nextDir)

// 4️⃣ 启动 PM2 服务
try {
	console.log('🚀 启动 my-next 服务...')
	execSync('npm run pm', { stdio: 'inherit' })
	console.log('✅ 服务启动完成')
} catch (err) {
	console.error('❌ 启动服务失败', err)
	process.exit(1)
}
