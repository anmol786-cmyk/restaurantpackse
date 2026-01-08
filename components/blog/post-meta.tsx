import { Calendar, User, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types/wordpress';

interface PostMetaProps {
  post: Post;
  showTags?: boolean;
  className?: string;
}

export function PostMeta({ post, showTags = false, className }: PostMetaProps) {
  // Calculate reading time (rough estimate: 200 words per minute)
  const getReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {/* Author */}
        {post.author && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{post.author.name}</span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        {/* Reading Time */}
        {post.content && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{getReadingTime(post.content)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {showTags && post.tags && post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
