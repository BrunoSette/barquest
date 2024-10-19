import { getPostBySlug } from "@/lib/posts";
import { ClockIcon, TagIcon } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface Params {
  [key: string]: string; // Add index signature
  slug: string;
}

interface Post {
  title: string;
  contentHtml: string;
  slug: string;
  author: string;
  readingTime: string;
  tags: string[];
  image: string;
  description?: string;
}

// Awaiting params inside generateMetadata
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params; // Awaiting params
  const post: Post | null = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description || `Read ${post.title} on our blog`,
    openGraph: {
      title: post.title,
      description: post.description || `Read ${post.title} on our blog`,
      images: [{ url: post.image }],
    },
  };
}

// Awaiting params inside PostPage
export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params; // Awaiting params here
  const post: Post | null = await getPostBySlug(resolvedParams.slug);

  if (!post || !post.title) {
    throw new Error(
      `Post data incomplete or not found for slug: ${resolvedParams.slug}`
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
          <nav>
            <Link
              href="/blog"
              className="text-primary hover:text-primary-dark transition-colors text-sm sm:text-base"
            >
              ← Back to all posts
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <article className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader className="space-y-3 sm:space-y-4">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </CardTitle>
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <ClockIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>{post.readingTime}</span>
              </div>
              <div className="flex items-center">
                <TagIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs sm:text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="prose dark:prose-invert max-w-none p-4 sm:p-6 text-sm sm:text-base">
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </CardContent>
        </article>
      </main>
    </div>
  );
}
