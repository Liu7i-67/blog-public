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

> JavaScript 的核心语法部分相当精简，只包括两个部分：基本的语法构造（比如操作符、控制结构、语句）和标准库（就是一系列具有各种功能的对象比如Array、Date、Math等）

除此之外的拓展由宿主环境提供，例如：
- 在浏览器中，给`JavaScript`提供了`DOM`相关的操作拓展
- 在`Nodejs`中，给`JavaScript`提供了文件操作等拓展

核心语法部分的标准由国际标准化组织 `ECMA（European Computer Manufacturers Association）`制定

除此之外部分的标准由其他组织制定，例如`DOM`部分是`W3C组织（World Wide Web Consortium）`制定的

因此大部分场景下`ECMAScript`和`JavaScript`是一样的

## 趣闻

`JavaScript`看起来像是服务于`Java`的脚本语言，事实上二者的关系并不大，`JavaScript`的基本语法和对象体系部分是模仿`Java`设计的，仅此而已

之所以名字叫做`JavaScript`是为了蹭`Java`的热度，一个巴掌拍不响，`Sun`公司为了拓展自身的影响力授权`Netscape`公司可以使用`JavaScript`去蹭

`ECMAScript`的诞生是因为微软开始搞自己的`JScript`标准，`Netscape`公司意识到自己应该干不过微软，所以选择将`JavaScript`提交给`ECMA`，希望`JavaScript`能够成为国际标准。由于版权等多种原因，这个标准不能再叫`JavaScript`，因此诞生了`ECMAScript`

# 基本语法

`var a = 1;`  
实际上是两个步骤，首先使用`var a`声明变量，然后把`1`赋值给变量`a`，等价于下面的语句
```javascript
var a;	// 此时a的值是undefined
a = 1;
```

## 变量提升
> `JavaScript` 引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升（`hoisting`）。

例如：
```js
console.log(a);
var a = 1;
```
等价于
```js
var a;
console.log(a);
a = 1;
```
因此并不会报错，控制台会输出`undefined`
 
## 注释

> 由于历史上 JavaScript 可以兼容 HTML 代码的注释，所以<!--和-->也被视为合法的单行注释。

下面这段代码在浏览器中运行不会报错，控制台输出为`1`
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
  <script>
    x = 1; <!-- x = 2;
    --> x = 3;
    console.log(x);
  </script>
</html>
```
需要注意的是，`-->`只有在行首，才会被当成单行注释，否则会当作正常的运算`--`和`>`。

## 区块

> `JavaScript` 使用大括号，将多个相关的语句组合在一起，称为“区块”（`block`）。

## if 结构
为了避免将`==`写作`=`，例如下面的场景
```js
var x = 1; 
if (x = 2) {
  console.log(x);
}
```
可以考虑交换数值和变量的位置
```js
// 交换位置后这段代码会报错
var x = 1; 
if (2 = x) {
  console.log(x);
}
```

## switch 结构
`switch`内部的`case`使用严格相等运算符（`===`），而不是相等运算符（`==`）

## break/continue 语句

> 如果存在多重循环，不带参数的`break`语句和`continue`语句都只针对最内层循环。

## 标签label

> JavaScript 语言允许，语句的前面有标签（label），相当于定位符，用于跳转到程序的任意位置，标签的格式如下。
```js
label:
  语句
```

例如：
```js
<script> 
	top: for (let i = 0; i < 10; i++) {
		for (let n = 0; n < 5; n++) {
			if (n > 2) {
				break top;
			}
			console.log(i, n);
		} 
	}
</script>
// 0 0
// 0 1
// 0 2
``` 
标签也可以用于跳出代码块。
```js
foo: {
  console.log(1);
  break foo;
  console.log('本行不会输出');
}
console.log(2);
// 1
// 2
```
**<span style="color:#ffa502">竟有此等神物！！！</span>**

之前多重循环找到目标之后我都是配合`continue`来减少循环次数的，居然可以直接结束吗！！！
