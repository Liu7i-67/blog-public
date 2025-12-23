> 折腾目标：一个可以离线使用的OCR应用

[成果](https://github.com/Liu7i-67/blog-public/releases/download/ocr0.0.1/q_ocr.zip)

![效果演示](/blogs/pywebview-rapidocr/2.webp)

技术路线上使用`react+ts`写前端页面，通过[pywebview](https://pywebview.flowrl.com/examples/expose.html)提供前端和`python`的交互

这部分比较简单，自行阅读一下`pywebview`的示例即可，核心是`OCR`部分

# PP-OCRv5
首先登场的是[PP-OCRv5](https://www.paddleocr.ai/latest/version3.x/pipeline_usage/OCR.html)，效果贼好，唯一的缺点就是初始化比较慢一丢丢，然后模型体积比较大，不适合用来打包

但是呢，官方提供了[教程转换为onnx模型](https://www.paddleocr.ai/latest/version3.x/deployment/obtaining_onnx_models.html?h=onnx)

我的电脑上安装环境一直出问题，不过问题不大，有大佬们转好的

[MAA的大佬们转好的](https://github.com/MaaXYZ/MaaCommonAssets/tree/main/OCR)

[RapidOCR的大佬们转好的](https://drive.google.com/drive/folders/1x_a9KpCo_1blxH1xFOfgKVkw1HYRVywY)

# onnx模型

> .onnx 是 Open Neural Network Exchange（开放神经网络交换）的文件扩展名，是一种用于表示深度学习模型的开放格式。ONNX 旨在让不同深度学习框架之间可以互相兼容和迁移模型。

这种格式就是为了部署而生的，但是对于我这种机器学习的小白还是有点难用，即便有`AI`的帮助，识图效果还是比`PP-OCRv5`原本的模型差了很多

本来是在一行一行的慢慢学习使用`.onnx`以达到一个好的识图效果，和`AI`交流中得知有[RapidOCR](https://rapidai.github.io/RapidOCRDocs/main/)这种神物，对我这种小白真是太友好了，初始化启动也很快

```python
# 初始化
self.ocr = RapidOCR(
    params={
        "Global.font_path": os.path.join(
            get_base_dir(), "./model/FZYTK.TTF"
        ),
        "Det.model_path": os.path.join(get_base_dir(), "./model/det.onnx"),
        "Cls.model_path": os.path.join(
            get_base_dir(), "./model/ch_ppocr_mobile_v2.0_cls_infer.onnx"
        ),
        "Rec.rec_keys_path": os.path.join(
            get_base_dir(), "./model/keys.txt"
        ),
        "Rec.model_path": os.path.join(get_base_dir(), "./model/rec.onnx"),
    }
)

# 使用
result = self.ocr(img_path)
```

学海无涯，能用就行，直接进行下一步打包

# 打包

我的项目结构大概是下面这样子，`web`里存放的是构建好的前端代码

![项目结构](/blogs/pywebview-rapidocr/12121asdadasd.png)

贴一下完整的打包配置`qspocr.spec`

``` python 
# -*- mode: python ; coding: utf-8 -*-
from pathlib import Path
import rapidocr

block_cipher = None

datas = []

# ===== rapidocr 必需的 yaml =====
rapidocr_dir = Path(rapidocr.__file__).resolve().parent
for v in rapidocr_dir.rglob('*.yaml'):
    datas.append(
        (str(v), str(Path('rapidocr') / v.parent.relative_to(rapidocr_dir)))
    )

# ===== 你自己的资源 =====
datas += [
    ('web', 'web'),
    ('model', 'model'),
]

a = Analysis(
    ['main.py'],
    pathex=['.'],
    datas=datas,
    hiddenimports=[
        'rapidocr',
        'omegaconf',
        'onnxruntime',   # RapidOCR 底层仍依赖
        'pywebview'
    ],
    noarchive=True,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='q_ocr',
    # 若是 GUI 程序可改为 False
    console=False,
    icon='assets/favicon.ico',
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    name='q_ocr',
)
```
比如要把`rapidocr`的一些`yaml`文件打包进去，否则无法正常运行

打包后神奇的发现这个包总体大小居然有`1.2G`？？？

直接就是满头问号，随即进行排查

发现产物中的`_internal`中存在很多我根本没有用到的依赖，比如`paddle`、`faiss`之类的

经过和`AI`的沟通已经反复尝试基本确定是`PyInstaller`把我电脑环境中全部的依赖都打包进去了...

解决方案也比较简单，创建一个`python`的虚拟环境，在这个虚拟环境中只安装必须的依赖，然后进行打包即可

```bash
# 注意这部分代码需要在cmd中允许，不要再gitbash中使用

# qi是自定义的名称，你可以随便输入
python -m venv qi
# 运行虚拟环境
qi\Scripts\activate.bat
# 查看python的路径是否指向虚拟环境
where python
# 安装依赖需要自己在requirements.txt中书写需要安装的依赖
pip install -r requirements.txt
# 打包
pyinstaller qspocr.spec
```

最终产物打包后约`133MB`，尚可

# 后续优化

- 部分图片会识别失败，需要排查问题
- 部分文字可辨识度不高时会识别失败
