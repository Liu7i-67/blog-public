很早之前使用`React Native`写了一个[简易版的神奇宝贝百科图鉴](https://github.com/Liu7i-67/qpm)

最近想要完善一下样式，首先想要加一个渐变背景，发现`React Native`不支持，需要使用[插件](https://www.npmjs.com/package/react-native-linear-gradient)实现，也行，能实现就行

下一步，准备添加一点阴影，`React Native`的支持度还是很低，`ios`段没有尝试（因为没有设备），安卓端的阴影样式是真的丑，神奇的`gpt`说`Flutter`的样式支持会好很多，整！

# 安装
[官方SDK安装教程](https://docs.flutter.dev/get-started/quick)

我是用`window`环境，编辑器使用`VS Code`，跟着官方教程安装没有遇到问题

我的目标是安卓平台，因为电脑上已经安装过`Andriod Studio`，跟着[教程](https://docs.flutter.dev/platform-integration/android/setup)安装一下所需工具即可

成功的创建了一个`demo`项目

# 运行

我使用了一个红米的手机真机运行，按照[官方教程](https://codelabs.developers.google.com/codelabs/flutter-codelab-first?hl=zh-cn#3)，点击运行图标一直卡在`starting debug session`，下面记录一下踩坑记录

## 踩坑记录

1. 卡在`starting debug session`  
首先结束运行，然后打开终端运行`flutter run -v`，这样可以查看运行时的日志
```bash
Administrator@PC-20250314YMFX MINGW64 /e/qbb/github/pokemondex7i/pokemondex7i $ flutter run -v [ +86 ms] Waiting to be able to obtain lock of Flutter binary artifacts directory: E:\qbb\flutter\flutter\bin\cache\lockfile [ +1 ms] Waiting for another flutter command to release the startup lock...
```
发现一个文件被锁定了，进入对应目录删除指定文件之后再次运行`flutter run -v`

这次卡在了
```bash
Downloading android-arm-profile/windows-x64 tools...
```
从谷歌下载文件的时候卡住了，听从`gpt`的建议，新增两个系统环境变量
| 名称 | 值 |
| --- | --- |
| FLUTTER_STORAGE_BASE_URL | https://storage.flutter-io.cn |
| PUB_HOSTED_URL | https://pub.flutter-io.cn |

<span style="color:#d1cccc">后面发现是因为我开了代理但是没有允许局域网使用代理</span>

将镜像源切换为国内源，**退出**`VS Code`重新打开，在终端再次运行`flutter run -v`
报错如下：
```bash
I/O exception ... http://127.0.0.1:7890 -> https://plugins.gradle.org:443: Connection reset
Retrying request...
```
我在安卓配置了代理，但是现在我的代理不允许局域网访问导致的，修改为允许即可

修改完成后再次允许，成功启动项目
![效果图](/blogs/to-flutter/9a971098e7d925ae.webp)

这种方式启动的项目没有后续的热更新，因此跑通了之后还是建议使用官方教程的方式进行运行


