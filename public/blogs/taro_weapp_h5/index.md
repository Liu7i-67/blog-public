> 一个简单的需求场景：客户需要一个静态页面用于展示公司的业务开展情况，需要微信小程序+H5页面

一看这个需求，脑子里直接锁定了`Taro`

# 集成tailwind

[官方集成示例](https://docs.taro.zone/en/docs/tailwindcss)

天下苦命名久矣！`Taro`也是可以使用`tailwind`的

我使用的`Taro 4.0.12`，集成方法如下

```bash
# 安装必要的依赖
pnpm install -D tailwindcss@^3 postcss autoprefixer
# 生成配置文件
npx tailwindcss init
```
运行后会生成`tailwind.config.js`，在`content`字段中加入需要使用的文件，例如：
```js
/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ["./public/index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
在项目根添加或修改`postcss.config.js`
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```
在`app.scss`中引入`tailwind`
```css
@use 'tailwindcss/base' as *;
@use 'tailwindcss/components' as *;
@use 'tailwindcss/utilities' as *;
```

## 安装weapp-tailwindcss
> 什么是 weapp-tailwindcss ? 它是一个让你在小程序环境中，使用 tailwindcss 大部分特性的一个 webpack, vite, gulp, postcss 插件集合。它支持目前上几乎所有主流的多端小程序框架和使用 webpack / gulp 的原生小程序开发打包方式。
> 
> weapp-tailwindcss 使得你很容易在各个框架，或原生开发中集成 tailwindcss。

```bash
# 安装依赖
pnpm i -D weapp-tailwindcss
```
修改`package.json`字段，新增`postinstall`命令
```json
"scripts": {
  "postinstall": "weapp-tw patch"
}
```
> 添加这段脚本的用途是，每次安装包后，都会自动执行一遍 weapp-tw patch 这个脚本，给本地的 tailwindcss 打上小程序支持补丁。

修改`config/index.js`文件
```js
const { UnifiedWebpackPluginV5 } = require('weapp-tailwindcss/webpack')
// 文件是 ts 则为
// import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'
{
  // 找到 mini 这个小程序配置
  mini: {
    webpackChain(chain, webpack) {
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [{
              appType: 'taro',
              // 下面个配置，会开启 rem -> rpx 的转化
              rem2rpx: true
            }]
          }
        }
      })
    }
  }
}
```

> rem2rpx 这个配置项，是用来开启 CSS rem -> rpx 单位的转化的，可以不传值来关闭这个转化行为。
>
>传 true 时，1rem 转化为 32rpx。可通过传入配置进行修改，详见 rem 转 rpx (或 px)
> 
> 在使用 Taro 时，需要把 config/index 的配置项中的 compiler 设置为插件对应的版本
>
> 如果使用 webpack4 则使用从 weapp-tailwindcss/webpack4 导出的 UnifiedWebpackPluginV4
>
> 如果使用 webpack5 则使用从 weapp-tailwindcss/webpack 导出的 UnifiedWebpackPluginV5
>
> 另外假如你使用了 taro-plugin-compiler-optimization 记得把它去除。因为和它一起使用时，它会使整个打包结果变得混乱。详见 issues/123 issues/131

现在可以使用`tailwindcss`了，如果你使用的是`VSCode`，安装好了`Tailwind CSS IntelliSense`但是没有语法提示，大概率需要退出重新打开一次即可

# 从weapp到h5

我在书写代码时全程使用了`rpx`，我先写的是小程序，写完之后构建`h5`，发现`rpx`被转换为了`rem`

`20rpx-->1rem`

整个页面看起来很怪异

修改起来也很简单

在`app.scss`中添加`rem`到`vw`的映射即可
```css
html {
  font-size: calc(100vw / 37.5) !important;
}
```