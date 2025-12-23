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
我在`Android Studio`配置了代理，但是现在我的代理不允许局域网访问导致的，修改为允许即可

修改完成后再次允许，成功启动项目
![效果图](/blogs/to-flutter/9a971098e7d925ae.webp)

这种方式启动的项目没有后续的热更新，因此跑通了之后还是建议使用官方教程的方式进行运行

<span style="color:#cbc8c8">计划有变，最近玩火炬之光无限比较多，先写个火炬之光无限的图鉴玩玩</span>

# 应用结构

[我的练手项目](https://github.com/Liu7i-67/torchlight_dex)

<span style="color:#ff4757">我也是刚接触`Flutter`，请带着批评性的目光阅读以下内容</span>

目前为止的体验比较类似用`kotlin`写安卓，但是写起来会更轻松一点，具体表现在不用引入特别多的包

## 入口文件

`demo`中入口文件位于`lib/main.dart`，可以将它理解为`react`的`index.tsx`

文件中的`runApp`类似于`react`中的`ReactDOM.render()`

## 组件

`Flutter`有一个`Widget`概念，类似于`React`中的`Component`

每一个`Widget`都可以作为一个页面存在

先看看下面的代码示例，展示了`Widget`的基本使用：
```dart
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
	  	// 定义页面的标题 可空
      appBar: AppBar(centerTitle: true, title: Text("首页")),
			// 内容
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('欢迎使用')
          ],
        ),
      ),
			// 侧边栏
      drawer: Drawer(
        child: SafeArea(
          child: Column(children: [const SizedBox(height: 10), Text('侧边栏')]),
        ),
      ),
      // 浮动按钮
      // floatingActionButton: FloatingActionButton(
      //   onPressed: () {
      //     print('啊哈');
      //   },
      //   child: const Icon(Icons.brightness_7_outlined),
      // ),
    );
  }
}
```
##　路由
`Flutter`的路由管理有多种形式，我个人倾向于下面这种类似于`React`的
```dart
import 'package:flutter/material.dart';
import 'package:torchlight_dex/pages/detail/detail.dart';
import 'package:torchlight_dex/pages/home/home.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "火炬之光",
      initialRoute: "/",
      routes: {
        '/': (context) => HomePage(),
        '/detail': (context) => DetailPage(),
      },
    );
  }
}
```

路由跳转
```dart
ElevatedButton(
  onPressed: () {
    Navigator.pushNamed(
      context,
      '/detail',
      arguments: {'id': 123, "title": "查询"},
    );
  },
  child: const Text("进入详情页"),
),
```

返回上一级
```dart
ElevatedButton(
  onPressed: () {
    Navigator.pop(context); // 返回
  },
  child: const Text("返回"),
)
```

# 资源引用

## json
某些场景下，会在json文件中存放很多用于渲染的数据，使用时再去加载，下面记录一下操作流程
- 在`[项目]/assets/data/`下存放需要的`json`文件，例如`pactspirit_list.json`
- 修改`[项目]/pubspec.yaml`文件，将目标`json`加入资源列表
```yaml
...
flutter:
  uses-material-design: true
  assets:
    - assets/data/pactspirit_list.json 
``` 
- 需要定义`json`文件的数据类型
```dart
// 可以在我的仓库里查看原本的json文件
import 'package:torchlight_dex/components/modifierLineWidget/modifier_model.dart';

class PactspiritItemModel {
  final int index;
  final String name;
  final String key;
  final String tag;
  final String rarity;
  final String desc;
  final List<List<ModifierPart>> modifier;

  PactspiritItemModel({
    required this.index,
    required this.name,
    required this.key,
    required this.tag,
    required this.rarity,
    required this.desc,
    required this.modifier,
  });

  factory PactspiritItemModel.fromJson(Map<String, dynamic> json) {
    // 解析 modifier: List<List<Map>>
    final modifierJson = json['modifier'] as List?;
    final List<List<ModifierPart>> modifier = [];

    if (modifierJson != null) {
      for (final line in modifierJson) {
        final List<dynamic> lineList = List<dynamic>.from(line);
        final List<ModifierPart> parsedLine = lineList
            .map((part) => ModifierPart.fromJson(part as Map<String, dynamic>))
            .toList();
        modifier.add(parsedLine);
      }
    }

    return PactspiritItemModel(
      index: json['index'],
      name: json['name'],
      key: json['key'],
      tag: json['tag'],
      rarity: json['rarity'],
      desc: json['desc'],
      modifier: modifier,
    );
  }
}
```
- 在需要使用的地方引入 [完整示例](https://github.com/Liu7i-67/torchlight_dex/blob/master/lib/pages/pactspirit/pactspirit.dart)
```dart
// 加载 JSON
Future<void> loadList() async {
  final jsonString = await rootBundle.loadString(
    'assets/data/pactspirit_list.json',
  );
  final List<dynamic> jsonList = json.decode(jsonString);
  final loadedList = jsonList
      .map((j) => PactspiritItemModel.fromJson(j))
      .toList();
  // 提取所有唯一 tag 和 rarity
  final tags = <String>{};
  final rarities = <String>{};
  for (final item in loadedList) {
    tags.add(item.tag);
    rarities.add(item.rarity);
  }
  setState(() {
    listsFuture = loadedList;
    _filteredLists = loadedList;
    _allTags = tags;
    _allRarities = rarities;
  });
} 
```

## 图片
`Flutter`中使用图片也比较简单
- 首先把需要使用的图片放置到`[项目]/assets/`中，例如我存放了很多契灵的图片在`[项目]/assets/images/pactspirit/`中
- 因为图片数量比较多，所以把整个目录都添加到资源列表，修改`[项目]/pubspec.yaml`文件
```yaml
...
flutter:
  uses-material-design: true
  assets: 
    - assets/images/pactspirit/ 
```
- 直接使用即可 [完整示例](https://github.com/Liu7i-67/torchlight_dex/blob/master/lib/pages/pactspirit/pactspirit_list_item.dart)
```dart
String imagePath = 'assets/images/pactspirit/${item.key}.webp';

Image.asset(
  imagePath,
  fit: BoxFit.fitHeight,
  frameBuilder:
      (
        BuildContext context,
        Widget child,
        int? frame,
        bool wasSynchronouslyLoaded,
      ) {
        if (wasSynchronouslyLoaded || frame != null) {
          return child;
        }
        return const Center(child: CircularProgressIndicator());
      },
)
```

# 打包
跟着[官方的打包流程](https://docs.flutter.dev/deployment/android)走即可

## 图标

推荐使用官方的[工具](https://pub.dev/packages/flutter_launcher_icons)制作打包后的图标，简单快捷 

## 应用名称

修改打包后的应用名称可以参考以下步骤
1. 打开`[项目]\android\app\src\main\AndroidManifest.xml`文件
2. 修改`android:label`对应的内容即可，例如修改为`火炬百科柒`
```xml
...
<application
        android:label="火炬百科柒"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">
...
```

## 版本号

每次打包记得更新版本号，修改`[项目]/pubspec.yaml`中的`version`字段即可


## 打包方式
推荐使用`flutter build apk --split-per-abi`进行打包，下面是几种打包命令的对比
| 特性 | flutter build apk | flutter build apk --release | flutter build apk --split-per-abi |
| --- | --- | --- | --- |
| 构建模式 | 默认是 Debug 模式 | Release 模式 | 默认是 Release 模式 |
| 代码优化 | <span style="color:#ff4757">无优化</span>，<br/>启用热重载、<br/>断言和调试信息。 | <span style="color:#2ed573">最大优化</span>：<br/>AOT 编译、<br/>代码最小化<br/> (Minification)、<br/>移除调试信息。 | <span style="color:#2ed573">最大优化</span><br/>继承自 Release 模式的特性。 |
| 目标用途 | 开发阶段，<br/>用于快速迭代和调试。 | 发布应用，<br/>用于正式上传到应用商店<br/>或分发给用户。 | 减小 APK 文件大小，<br/>适用于分发给用户。 |
| 输出文件 | 一个 Debug APK <br/>文件。 | 一个 “胖 (Fat)” Release APK<br/> 文件（包含所有<br/>CPU 架构的代码）。 | 多个 小型 Release APK<br/> 文件（每个文件<br/>只包含一个 CPU 架构的代码）。 |
| 文件大小 | <span style="color:#ff4757">较大</span> | <span style="color:#1e90ff">大</span> | <span style="color:#2ed573">小</span> |