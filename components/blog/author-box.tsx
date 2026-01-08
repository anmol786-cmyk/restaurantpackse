import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';
import type { Author } from '@/types/wordpress';

interface AuthorBoxProps {
  author: Author;
  className?: string;
}

export function AuthorBox({ author, className }: AuthorBoxProps) {
  return (
    <div className={`rounded-lg border bg-muted/50 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold">
            {author.url ? (
              <Link
                href={author.url}
                className="transition-colors hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {author.name}
              </Link>
            ) : (
              author.name
            )}
          </h3>

          {author.description && (
            <p className="text-sm text-muted-foreground">{author.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
