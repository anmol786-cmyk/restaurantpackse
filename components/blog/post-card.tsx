import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import type { Post } from '@/types/wordpress';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  showExcerpt?: boolean;
}

export function PostCard({ post, showExcerpt = true }: PostCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
      {/* Featured Image */}
      {post.featured_image?.src && (
        <Link href={`/posts/${post.slug}`} className="block overflow-hidden">
          <div className="relative aspect-[16/9] bg-muted">
            <Image
              src={post.featured_image.src}
              alt={post.featured_image.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.categories.slice(0, 2).map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/posts/${post.slug}`}>
          <h3 className="mb-3 text-xl font-bold transition-colors hover:text-primary">
            {post.title}
          </h3>
        </Link>

        {/* Meta Info */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <div
            className="prose prose-sm line-clamp-3 max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        {/* Read More Link */}
        <Link
          href={`/posts/${post.slug}`}
          className="mt-4 inline-block font-medium text-primary transition-colors hover:text-primary/80"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}
