if pm2 describe my_blog >/dev/null 2>&1; then
  pm2 delete my_blog
fi  
pnpm install
npm run build
npm run pm