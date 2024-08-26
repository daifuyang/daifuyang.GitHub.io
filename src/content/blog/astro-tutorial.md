---
title: "利用astro快速搭建个人博客"
desc: "还在为搭建个人博客而烦恼吗？快来学习astro吧！"
date: "2024-08-25 12:14:00"
category: "astro"
tags: ["astro"]
---

## 前言

最近在搭建个人博客，发现 astro 这个框架非常适合用来搭建个人博客，所以打算写一篇教程，帮助大家快速搭建个人博客。

## 什么是 astro

astro 是一个基于 JavaScript 的静态网站生成器，它可以帮助你快速搭建一个静态网站。astro 的特点是速度快、易用性强、支持 Markdown、支持 React、支持 Vue 等。

## 如何搭建个人博客

优先推荐官方文档：[搭建你的 Astro 博客](https://docs.astro.build/zh-cn/tutorial/0-introduction/)

### 前提条件

- Node.js - v18.17.1 或 v20.3.0 或更高版本。（不支持 v19。）
- 文本编辑器 - 我们推荐使用 VS Code 并安装我们的 官方 Astro 扩展。
- 终端 - Astro 通过其命令行界面（CLI）访问。

### 创建项目

推荐使用 pnpm 包管理器，由于我使用的是 pnpm，所以以下教程以 pnpm 为例。

1. 在终端的命令行中，使用你首选的包管理器运行以下命令：

```bash
pnpm create astro@latest
```

2. 确认后安装 create-astro

3. 安装提示创建一个默认项目，默认推荐即可

### 启动项目

输入`pnpm run dev`即可以开发模式启动项目，默认开发端口为 4321，访问`http://localhost:4321`即可看到项目效果。

### 内容集成

astro 支持多种内容的管理方式：内容集合、无头 CMS 等。本次我们先介绍系统自带的内容集合方案.

编辑**src/content/config.ts**

```ts
const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    /* ... */
  }),
});
const newsletter = defineCollection({
  type: "content",
  schema: z.object({
    /* ... */
  }),
});
const authors = defineCollection({
  type: "data",
  schema: z.object({
    /* ... */
  }),
});

export const collections = {
  blog: blogCollection,
  newsletter: newsletter,
  authors: authors,
};
```

### 列表渲染

编辑**src/pages/blog/index.astro**

```astro
---
import { getCollection } from "astro:content";
const blogEntries = await getCollection("blog");
---

<ul>
  {
    blogEntries.map((blogPostEntry) => (
      <li>
        <a href={`/blogs/${blogPostEntry.slug}`}>{blogPostEntry.data.title}</a>
        <time datetime={blogPostEntry.data.publishedDate.toISOString()}>
          {blogPostEntry.data.publishedDate.toDateString()}
        </time>
      </li>
    ))
  }
</ul>
```

### 渲染详情页

编辑**src/pages/posts/[...slug].astro**

```astro
---
import { getCollection } from "astro:content";
// 1. 为每个集合条目生成一个新路径
export async function getStaticPaths() {
  const blogEntries = await getCollection("blog");
  return blogEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
// 2. 当渲染的时候，你可以直接从属性中得到条目
const { entry } = Astro.props;
const { Content } = await entry.render();
---

<h1>{entry.data.title}</h1>
<Content />
```

### 美化页面

我们通过tailwindcss来美化我们的页面

1. 通过`pnpm astro add tailwind`自动安装tailwindcss
2. 使用 Tailwind Typography 美化渲染后的 Markdown

首先，使用你喜欢的包管理器安装 @tailwindcss/typography。

```bash
pnpm add -D @tailwindcss/typography
```

然后，在你的 Tailwind 配置文件中添加该包作为插件。

**tailwind.config.js**

```ts
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    // ...
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
```

**创建消费组件**

编辑**src/components/Prose.astro**

```astro
---

---

<div
  class="prose prose-lg sm:prose-base md:prose-base lg:prose-lg dark:prose-invert mx-auto"
>
  <slot />
</div>
```

**使用组件**
编辑**src/pages/index.astro**

```astro
---
import Prose from "../components/Prose.astro";
import Layout from "../layouts/Layout.astro";
import { getEntry } from "astro:content";

const entry = await getEntry("collection", "entry");
const { Content } = await entry.render();
---

<Layout>
  <Prose>
    <Content />
  </Prose>
</Layout>
```

## 总结

通过以上步骤，你已经成功搭建了一个基于 astro 的个人博客。你可以根据自己的需求，添加更多的内容、样式和功能。希望这个教程能帮助你快速搭建自己的博客，祝你好运！
