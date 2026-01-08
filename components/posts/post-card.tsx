import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getCategoryById,
} from "@/lib/wordpress";

export async function PostCard({ post }: { post: Post }) {
  let media = null;
  if (post.featured_media) {
    try {
      media = await getFeaturedMediaById(post.featured_media);
    } catch (e) {
      // console.error(`Failed to fetch media for post ${post.id}`, e);
    }
  }

  // Author fetch removed as it is unused in the component

  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  let category = null;
  if (post.categories?.[0]) {
    try {
      category = await getCategoryById(post.categories[0]);
    } catch (e) {
      // console.error(`Failed to fetch category for post ${post.id}`, e);
    }
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "p-4 bg-card rounded-2xl group flex justify-between flex-col not-prose gap-8",
        "shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center bg-muted">
          {media?.source_url ? (
            <Image
              className="h-full w-full object-cover"
              src={media.source_url}
              alt={post.title?.rendered || "Post thumbnail"}
              width={400}
              height={200}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No image available
            </div>
          )}
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
        ></div>
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html: post.excerpt?.rendered
              ? post.excerpt.rendered.split(" ").slice(0, 12).join(" ").trim() +
              "..."
              : "No excerpt available",
          }}
        ></div>
      </div>

      <div className="flex flex-col gap-4">
        <hr />
        <div className="flex justify-between items-center text-xs">
          <p>{category?.name || "Uncategorized"}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}
