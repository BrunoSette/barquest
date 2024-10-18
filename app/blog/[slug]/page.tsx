import { getPostBySlug } from "@/lib/posts";
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface Params {
  slug: string;
}

interface Post {
  title: string;
  date: string;
  contentHtml: string;
  slug: string;
  author: string;
  readingTime: string;
  tags: string[];
  image: string;
  description?: string;
}

export default async function PostPage({ params }: { params: Params }) {
  const post: Post | null = await getPostBySlug(params.slug);

  if (!post || !post.title || !post.date) {
    throw new Error(
      `Post data incomplete or not found for slug: ${params.slug}`
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <nav>
            <Link
              href="/blog"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              ← Back to all posts
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <article className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="relative h-64 sm:h-80 md:h-96">
            <Image
              src={post.image || "/placeholder.svg?height=384&width=768"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4" />
                <span>{post.readingTime}</span>
              </div>
              <div className="flex items-center">
                <TagIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="prose dark:prose-invert max-w-none p-6">
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </CardContent>
        </article>
      </main>

      <footer className="bg-white dark:bg-gray-800 mt-12">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Barquest Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
