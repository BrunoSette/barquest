import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { readFile } from "fs/promises";

const postsDirectory = path.join(process.cwd(), "posts");

// Get slugs without the .md extension
export function getPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .map((file) => file.replace(/\.md$/, ""));
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`); // Append .md back here
  const fileContents = await readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags,
    image: data.image,
    description: data.description,
    contentHtml, // This is now the HTML string
  };
}

export async function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPostBySlug(slug);
      return post;
    })
  );

  // Filter out any null posts (in case of errors)
  return posts
    .filter((post) => post !== null)
    .sort((post1, post2) =>
      new Date(post2.date) > new Date(post1.date) ? 1 : -1
    );
}
