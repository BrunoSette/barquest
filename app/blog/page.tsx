import { getAllPosts } from "@/lib/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function BlogPage() {
  const posts = await getAllPosts();
  // console.log("Posts:", posts); // Keep this for debugging

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(
            (post) =>
              post && (
                <Card
                  key={post.slug}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image}
                        alt={post.title || "Blog post image"}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
                        {post.title || "Untitled"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {post.description && (
                        <p className="mt-0 text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3">
                          {post.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags &&
                            post.tags.slice(0, 2).map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs sm:text-sm"
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
          )}
        </div>
      </main>
    </div>
  );
}
