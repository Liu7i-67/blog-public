我之前用`Flutter`写了一个宝可梦图鉴`APP`，准备增加更多的在游戏中会用到宝可梦信息，比如特性、蛋组、雌雄比例、技能池、进化方式...等等

事实上我已经从[神奇宝贝百科](https://wiki.52poke.com/wiki/%E4%B8%BB%E9%A1%B5)抓取过很多次数据了，但是呢起的项目太多了，很多数据不知道放哪里去了，而且之前抓取的数据也不太详尽

为了更多的可维护性，我决定直接给数据写到数据库里

这样的好处在于:

- 可以存储更多的信息以便后续使用
- 可以一点点的完善追加，通过全国编号和宝可梦形态做关联
- 可以组合出任何我需要的数据结构
- 数据不容易丢失

我设计的技术路线是这样的：

- 使用`Nextjs`+`mysql`+`prisma`+`antd`+`tailwindcss`实现一个后台，提供接口和数据展示
- 使用`react`+`tailwindcss`写一个浏览器插件，抓取数据后调用接口将数据写入到数据库中

上面的内容对我比较有挑战的部分在于`Nextjs`和`prisma`，都没怎么用过

不过呢问题也不大，虽然没怎么玩过`Nextjs`但是也写了好些年`React`了，虽然没用过`prisma`，但是玩过`TypeORM`呀，开整！


使用的核心库版本如下：
```bash 
"antd": "^6.2.2",
"next": "16.1.5",
"react": "19.2.3",
"prisma": "^7.3.0",
"tailwindcss": "^4",
"typescript": "^5"
```

# 第一步

链接数据库，跟着[官方教程](https://www.prisma.io/docs/getting-started/prisma-orm/add-to-existing-project/mysql)走即可

# 第二步

写一个`api`接口，简单定义一个`POST`接口`/api/pokemon`

创建文件`app/api/pokemon/route.ts`
```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. 基础数据验证 (建议使用 Zod 进一步加强验证)
    const {
      no,
      name,
      regional,
      attr,
      attr2,
      bs_hp,
      bs_atk,
      bs_def,
      bs_spa,
      bs_spd,
      bs_spe,
    } = body;

    if (!no || !name || !attr) {
      return NextResponse.json(
        { error: "缺少必填字段: no, name 或 attr" },
        { status: 400 }
      );
    }

    // 2. 使用 Prisma 事务保证原子性
    const result = await prisma.$transaction(async (tx) => {
      // 检查编号是否已存在
      const existing = await tx.pokemon.findUnique({
        where: { no: Number(no) },
      });

      let basePokemon;
      if (!existing) {
        // 如果不存在，创建基础宝可梦记录
        basePokemon = await tx.pokemon.create({
          data: {
            no: Number(no),
            name: name,
          },
        });
      } else {
        basePokemon = existing;
      }

      // 创建形态/数值记录 (即便 no 相同，形态 regional 也可以不同，如“普通”和“洗翠”)
      const regionalForm = await tx.pokemonRegional.create({
        data: {
          no: Number(no),
          regional: regional || "普通形态",
          attr: attr,
          attr2: attr2 || null,
          bsHp: bs_hp ? Number(bs_hp) : null,
          bsAtk: bs_atk ? Number(bs_atk) : null,
          bsDef: bs_def ? Number(bs_def) : null,
          bsSpa: bs_spa ? Number(bs_spa) : null,
          bsSpd: bs_spd ? Number(bs_spd) : null,
          bsSpe: bs_spe ? Number(bs_spe) : null,
        },
      });

      return { basePokemon, regionalForm };
    });

    return NextResponse.json(
      { message: "新增成功", data: result },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Error:", error);

    // 处理 Prisma 唯一约束冲突 (错误码 P2002)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "该编号或名称已存在" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
```

# 第三步

在页面展示数据，修改`app/page.tsx`

```ts
import { prisma } from "@/lib/prisma";
import PokemonList from "./PokemonList";

export default async function Home() {
  // 获取所有宝可梦
  const pokemons = await prisma.pokemon.findMany({});
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">我的宝可梦中心</h1>

      <PokemonList pokemons={pokemons} />
    </main>
  );
}
```
`PokemonList`是一个客户端组件，神奇的事情发生了

## 问题一

`page.tsx`中`tailwindcss`正常工作，`PokemonList`中`tailwindcss`罢工了

两个文件都在`app/`目录中

经过排查定位到问题出现在我封装的`AntdProvider`组件

在我的理解里，`Nextjs`的核心是服务器组件，因此我不能将`layout`层包裹`antd`的`ConfigProvider`

为了方便使用且统一主题，我在`app`目录的同级创建了`components/AntdProvider.tsx`，内容如下

```ts
"use client";

import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";

export const AntdProvider = (props: { children?: React.ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean | number>(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    localStorage.setItem("isDark", media.matches.toString());
    setIsDark(media.matches);

    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  let local_dark = false;

  try {
    local_dark = localStorage.getItem("isDark") === "true";
  } catch (error) {}

  let algorithm = theme.defaultAlgorithm;
  if (typeof isDark === "boolean") {
    algorithm = isDark ? theme.darkAlgorithm : theme.defaultAlgorithm;
  } else if (local_dark) {
    algorithm = theme.darkAlgorithm;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm,
      }}
    >
      {props.children}
    </ConfigProvider>
  );
};
```

`Nextjs`的模板里没有生成`tailwind.config.js`，可能是集成到默认配置中了，我创建了`tailwind.config.js`将`components`中的内容也加入`content`问题就解决了

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
 