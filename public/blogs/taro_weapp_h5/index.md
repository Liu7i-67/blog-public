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

## 平台差异化
部分样式在`h5`中会失效，例如`border-[2rpx]`

两种解决方案：
1. 将当前文件名`X.tsx`修改为`X.weapp.tsx`  
复制粘贴一个当前文件修改为`X.h5.tsx`  
在`h5`文件中修改为`border-[1px]`  
编译时`taro`会根据运行命令读取对应的文件  
强迫症会比较难受  
在引入`X`文件的地方`IDE`会爆红
2. 通过`style`进行设置

> 考虑到兼容h5，尽量在使用h-[100vh]时使用h-[100dvh]代替  
否则某些浏览器的导航栏部分会占用可视区域宽度，导致原本一屏展示的想法落空

## 设置h5网站图标
在`src/index.html`中添加图标
```html
<link rel="icon" href="/logo.png" type="image/png" />
```
将图标放置到`根目录/public/`下  
修改`config/index.ts`（`taro`不会自动复制`public`到产物中）
```ts
...
copy: {
    patterns: [
        {
          from: "public",
          to: "dist",
        },
      ],
      options: {},
},
...
```

## 真机调试

由于我的手机和电脑不在一个网段，因此无法使用局域网进行访问

真机效果和电脑端模拟还是有区别的，这一步无法跳过

这时候需要使用`usb`链接手机和电脑通过`adb`进行端口映射

```bash
# 在手机上 设置--> 开发者选项 --> USB调试
# 不同手机进入开发者模式的方式不同，自行搜索自己的手机如何进入开发者模式
# 大概率是多次点击系统OS版本号

# 在电脑端查询可用的移动端设备，如果啥也没有说明没连接上
adb devices

# 假设项目在电脑端运行的端口是10086，可以进行如下的端口映射
adb reverse tcp:10086 tcp:10086

# 此时可以使用手机直接访问http://localhost:10086
```

### 拓展一下adb相关操作
```bash
# 电脑端访问手机端服务（反向映射）
adb forward tcp:10086 tcp:10086

# 查看当前全部映射
adb reverse --list
adb forward --list

# 取消某个端口映射
adb reverse --remove tcp:10086
adb forward --remove tcp:10086

# 取消全部端口映射
adb reverse --remove-all
adb forward --remove-all
```





