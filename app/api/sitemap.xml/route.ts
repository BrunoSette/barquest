import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.barquest.ca";

  const posts = await getAllPosts(); // Get dynamic routes, e.g., blog posts

  const staticPages = [
    "",
    "/blog",
    "/sign-in",
    "/terms-of-use",
    "/privacy-policy",
  ].map((page) => {
    return `${baseUrl}${page}`;
  });

  const dynamicPages = posts.map((post) => {
    return `${baseUrl}/blog/${post.slug}`;
  });

  const allPages = [...staticPages, ...dynamicPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages
        .map((url) => {
          return `
          <url>
            <loc>${url}</loc>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
          </url>
        `;
        })
        .join("")}
    </urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
