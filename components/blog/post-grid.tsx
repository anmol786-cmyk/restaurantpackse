import { PostCard } from './post-card';
import type { Post } from '@/types/wordpress';
import { cn } from '@/lib/utils';

interface PostGridProps {
  posts: Post[];
  columns?: 2 | 3;
  showExcerpt?: boolean;
  className?: string;
}

export function PostGrid({
  posts,
  columns = 3,
  showExcerpt = true,
  className,
}: PostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No posts found</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        {
          'md:grid-cols-2': columns === 2,
          'md:grid-cols-2 lg:grid-cols-3': columns === 3,
        },
        className
      )}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showExcerpt={showExcerpt} />
      ))}
    </div>
  );
}
