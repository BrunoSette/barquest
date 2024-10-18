import { getAllPosts } from "@/lib/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function BlogPage() {
  const posts = await getAllPosts();
  console.log("Posts:", posts); // Keep this for debugging

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Barquest Blog
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                          width={384}
                          height={192}
                          className="object-cover object-center"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                            aspectRatio: "2/1",
                          }}
                        />
                      </div>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
                          {post.title || "Untitled"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString()}
                          </time>
                        </div>
                        {post.description && (
                          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
                            {post.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.tags &&
                              post.tags.slice(0, 3).map((tag: string) => (
                                <Badge key={tag} variant="secondary">
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
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} BarQuest Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
