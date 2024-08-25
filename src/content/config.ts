// 1. 从 `astro:content` 导入
import { defineCollection } from "astro:content";
import { astroSchema } from "../schemas";
// 2. 定义集合
const blog = defineCollection({
  type: "content",
  schema: astroSchema,
});
// 3. 导出一个 `collections` 对象来注册集合
//    这个键应该与 `src/content` 中的集合目录名匹配
export const collections = {
  blog,
};
