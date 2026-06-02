## 将内网ip映射到域名上

修改`C:\Windows\System32\drivers\etc\hosts`文件  
添加`ip`到域名的映射

```txt
# ip 域名
140.82.114.26 alive.github.com
```

## 让该代理避开该域名直连

我的代理是`Clash for Windows v0.20.16.4`

### 方案一 JavaScript方案

`设置`-->`Mixin`-->`编辑JavaScript`
```js
module.exports.parse = ({ content, name, url }, { yaml, axios, notify }) => {
  // 确保 rules 存在
  if (!content.rules) {
    content.rules = [];
  }

  // 将直连规则插入到原有规则的最前面
  content.rules.unshift('DOMAIN,api.test.taoxiplan.com,DIRECT');

  // 必须返回 content 对象
  return content;
}fig;
}
```
`常规`-->启动`Mixin`


### 方案二 YAML方案

`设置`-->`Mixin`-->`编辑YAML`
```txt
mixin:
  rules:
    - DOMAIN,alive.github.com,DIRECT
```

`常规`-->启动`Mixin`

> 该访问会覆盖掉原本订阅文件里的所有规则，导致你的配置文件里现在只剩下这一条直连规则，其他网站（如 GitHub）因为找不到匹配的代理规则而无法访问。

### 拓展一下Mixin

- 可以用来修改本地端口、允许局域网连接、切换运行模式等。
```txt
mixin:
  port: 7890         # HTTP 代理端口
  socks-port: 7891   # SOCKS5 代理端口
  allow-lan: true    # 允许局域网连接
  mode: rule         # 运行模式: rule(规则), global(全局), direct(直连)
  log-level: info    # 日志级别
```

- 可以在原有规则的最上方追加自定义规则（如你前面用到的 DIRECT 直连）
```txt
mixin:
  rules:
    - DOMAIN,api.test.taoxiplan.com,DIRECT  # 精确域名直连
    - DOMAIN-SUFFIX,google.com,PROXY        # 后缀匹配走代理
    - DOMAIN-KEYWORD,baidu,DIRECT           # 关键字匹配直连
    - GEOIP,CN,DIRECT                       # 中国大陆 IP 直连
```

- 可以用来创建新的策略组，或者向已有策略组中插入自定义节点
```txt
mixin:
  proxy-groups:
    - name: 🚀 我的自定义分组
      type: select
      proxies:
        - 节点A
        - DIRECT
```

- 如果你需要防止 DNS 污染，或者在本地使用特定的 DNS 解析服务，可以通过 Mixin 强行覆盖订阅自带的 DNS 设置
```txt
mixin:
  dns:
    enable: true
    listen: 0.0.0.0:53
    enhanced-mode: redir-host # 或 fake-ip
    nameserver:
      - 223.5.5.5
      - 119.29.29.29
    fallback:
      - 8.8.8.8
      - 1.1.1.1
```

- 设置哪些 IP 或域名彻底不走 Clash 核心（即不经过 Clash 软件处理，直接由系统网卡发包）
```txt
mixin:
  bypass:
    - localhost
    - 127.0.0.1
    - 192.168.0.0/16
    - '*.local'
```

- 针对需要虚拟网卡接管全网流量的游戏或特种网络场景
```txt
mixin:
  tun:
    enable: true
    stack: gvisor # 或 system
    dns-hijack:
      - 'any:53'
    auto-route: true
    auto-detect-interface: true
```

> Mixin 默认是**“覆盖/追加”逻辑。例如你写了 rules:，Mixin 会把你的规则拼接到原本配置文件的最上方**（优先匹配）。  
缩进必须严格使用空格（YAML 语法），千万不能用 Tab 键，否则 CFW 会报错无法解析。


## 本地后端服务允许跨域，但是前端仍然无法访问后端服务
> 原因是新版本的chrome进行了显示，需要修改配置

访问`chrome://flags/`，搜索`Local Network Access Checks`，将配置项内容修改为`disabled`