## 问题描述
> 系统环境：win10  
浏览器：Chrome 145.0.7632.160  
浏览器插件：React1s 1.0.7  
IDE:vscode  

浏览器插件可以在`react`项目运行时，点击网页跳转到`vscode`指定文件，现在突然失效了，控制台输出如下内容：
```bash
Launched external handler for 'vscode://file/E:%5Cqbb%5Cgitlab%5Ctaoxi-web%5Csrc%5Ccomponents%5CTXTable%5Cmodules%5CTableList.tsx:23:7'.
```
直接在浏览器访问
```bash
vscode://file/E:%5Cqbb%5Cgitlab%5Ctaoxi-web%5Csrc%5Ccomponents%5CTXTable%5Cmodules%5CTableList.tsx:23:7
```
浏览器会提示有个网站想要打开vscode，点击打开后没能打开

在文件管理器直接访问
```
vscode://file/E:%5Cqbb%5Cgitlab%5Ctaoxi-web%5Csrc%5Ccomponents%5CTXTable%5Cmodules%5CTableList.tsx:23:7
```
可以打开`vscode`并跳转到指定行

## 解决方案

关闭当前所有`Chrome`浏览器窗口，使用管理员身份重新运行chrome即可


## 过程
我一直在使用一个[浏览器插件React1s](https://chromewebstore.google.com/detail/react1s/gpcoahaomdfmekggblkckofkgjggnjlp)

它的作用是，我在写`React`项目时，它可以很方便的直接从网页元素直接定位到`vscode`中的对应代码

用了几年了一直挺爽的，这两天突然就失灵了

第一时间为了研发进度没有去追寻原因

闲暇之余研究研究是怎么个情况

首先打开[插件市场](https://chromewebstore.google.com/detail/react1s/gpcoahaomdfmekggblkckofkgjggnjlp)，发现并没有人有和我一样的情况

打开作者的[github仓库](https://github.com/aaamoon/react1s/issues?q=is%3Aissue)，发现也没有人反馈相关问题

<span style="color:#42c2b3">那么大概率是我的问题了</span>

`AI`建议我去查看各种配置，问题是我最近也没有改过设置呀

折腾了一大圈，`Gemini`建议我关闭所有`Chrome`浏览器窗口，使用管理员身份运行

问题解决了！