import { ReactNode } from 'react';
import { Section } from '@/components/craft';
import { Breadcrumbs, BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { PostGrid } from '@/components/blog/post-grid';
import type { Post } from '@/types/wordpress';

interface BlogArchiveTemplateProps {
  title: string;
  description?: string | ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  posts: Post[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  basePath: string;
  sidebar?: ReactNode;
  columns?: 2 | 3;
  showExcerpt?: boolean;
}

export function BlogArchiveTemplate({
  title,
  description,
  breadcrumbs,
  posts,
  totalPosts,
  currentPage,
  totalPages,
  basePath,
  sidebar,
  columns = 3,
  showExcerpt = true,
}: BlogArchiveTemplateProps) {
  return (
    <Section>
      <div className="container px-4 md:px-6">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-bold">{title}</h1>
          {description && (
            <div className="text-muted-foreground">
              {typeof description === 'string' ? <p>{description}</p> : description}
            </div>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {posts.length} of {totalPosts} posts
          </p>
        </div>

        {/* Content Grid with Optional Sidebar */}
        <div className={sidebar ? 'lg:grid lg:grid-cols-4 lg:gap-8' : ''}>
          {/* Sidebar */}
          {sidebar && (
            <aside className="mb-8 lg:col-span-1 lg:mb-0">{sidebar}</aside>
          )}

          {/* Posts Grid */}
          <div className={sidebar ? 'lg:col-span-3' : ''}>
            <PostGrid posts={posts} columns={columns} showExcerpt={showExcerpt} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {currentPage > 1 && (
                  <a
                    href={`${basePath}?page=${currentPage - 1}`}
                    className="rounded-md border px-4 py-2 transition-colors hover:bg-muted"
                  >
                    Previous
                  </a>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <a
                      key={pageNumber}
                      href={`${basePath}?page=${pageNumber}`}
                      className={`rounded-md border px-4 py-2 transition-colors hover:bg-muted ${currentPage === pageNumber
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : ''
                        }`}
                    >
                      {pageNumber}
                    </a>
                  );
                })}

                {currentPage < totalPages && (
                  <a
                    href={`${basePath}?page=${currentPage + 1}`}
                    className="rounded-md border px-4 py-2 transition-colors hover:bg-muted"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
