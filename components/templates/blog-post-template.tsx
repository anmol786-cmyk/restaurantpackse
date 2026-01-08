import { ReactNode } from 'react';
import Image from 'next/image';
import { Section } from '@/components/craft';
import { Breadcrumbs, BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { PostMeta } from '@/components/blog/post-meta';
import { AuthorBox } from '@/components/blog/author-box';
import { PostGrid } from '@/components/blog/post-grid';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/types/wordpress';

interface BlogPostTemplateProps {
  post: Post;
  breadcrumbs?: BreadcrumbItem[];
  relatedPosts?: Post[];
  additionalContent?: ReactNode;
  showAuthorBox?: boolean;
  showRelatedPosts?: boolean;
}

export function BlogPostTemplate({
  post,
  breadcrumbs,
  relatedPosts = [],
  additionalContent,
  showAuthorBox = true,
  showRelatedPosts = true,
}: BlogPostTemplateProps) {
  return (
    <>
      <Section>
        <div className="site-container">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="mb-6" />
          )}

          {/* Post Header */}
          <article>
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold lg:text-5xl">{post.title}</h1>

            {/* Post Meta */}
            <PostMeta post={post} showTags={true} className="mb-8" />

            {/* Featured Image */}
            {post.featured_image?.src && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={post.featured_image.src}
                  alt={post.featured_image.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            )}

            {/* Post Content */}
            {post.content && (
              <div
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Additional Content */}
            {additionalContent && (
              <div className="mt-8">{additionalContent}</div>
            )}

            {/* Author Box */}
            {showAuthorBox && post.author && (
              <div className="mt-12">
                <AuthorBox author={post.author} />
              </div>
            )}
          </article>
        </div>
      </Section>

      {/* Related Posts */}
      {showRelatedPosts && relatedPosts && relatedPosts.length > 0 && (
        <Section className="bg-muted/50">
          <div className="site-container">
            <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
            <PostGrid posts={relatedPosts.slice(0, 3)} columns={3} showExcerpt={false} />
          </div>
        </Section>
      )}
    </>
  );
}
