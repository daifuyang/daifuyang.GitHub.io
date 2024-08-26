import { z } from "astro:content";

export const astroSchema = z.object({
  title: z.string(),
  desc: z.string(),
  date: z.string(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
});
