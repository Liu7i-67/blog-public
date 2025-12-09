# 前言

不知不觉进入前端这个领域已经5年有余，时常感觉自己的前端基础知识有许多空缺，故而打算阅读一下阮一峰老师的[ES6 入门教程](https://es6.ruanyifeng.com/)。在教程的前言有这样一句话

> 如果你是 JavaScript 语言的初学者，建议先学完《JavaScript 语言教程》，再来看本书。 

因此我决定先阅读一下[《JavaScript 语言教程》](https://wangdoc.com/javascript/basic/introduction)，查漏补缺一番

`JavaScript`是脚本语言`script language`也是嵌入式`embedded`语言：
- 脚本语言的特征  
	- 依赖宿主环境
	- 无法直接操作硬件
	- 跨平台能力强
	- 开发效率高
- 嵌入式`embedded`语言的特征
	- 语言设计的核心目标是在宿主环境内置执行脚本
	- 良好的跨平台性，只要宿主程序提供嵌入接口，脚本语言就可以在不同操作系统、不同环境运行

`JavaScript`诞生之初的宿主环境是浏览器  

后来`Nodejs`出现了，`Nodejs`使用`C/C++`给`JavaScript`提供了和系统交互的环境，使得`JavaScript`可以作为一种服务器语言

之后的`bun`、`Deno`之类也是一样的原理，使用其他的系统语言给`JavaScript`创造一个和系统交互的环境

理论上只要你够强，你可以用任意系统语言构建一个新的`JavaScript`运行环境，比如`Python`










