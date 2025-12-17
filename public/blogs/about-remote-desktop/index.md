身为一个社畜，即使下班了偶尔也会有问题需要处理

因为公司有许多的内网服务，最快捷的方法便是远程桌面，使用向日葵之类的软件

有一个尴尬的问题就是，公司的电脑有两个屏，家里只有一个屏，所以我只能看到主屏，时常打开软件出现在副屏，难受的很

<span style="color:#a9a7a7">*我现在知道可以切换屏幕了 0.0*</span>

突然灵机一动，写两个`bat`命令放在主屏，用来快速切换展示模式不就好了

## 切换到复制模式
```bat
@echo off
REM 使用 Windows 自带的 DisplaySwitch 工具切换到“复制”模式
DisplaySwitch.exe /clone
```

## 切换到扩展模式
```bat
@echo off
REM 使用 Windows 自带的 DisplaySwitch 工具切换到“复制”模式
DisplaySwitch.exe /extend
```

实际上直接搜索`DisplaySwitch`运行切换也很方便，不过比直接双击`bat`还是差点