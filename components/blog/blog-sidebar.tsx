import Link from 'next/link';
import { getPostsPaginated, getRecentComments, getAllCategories, getAllTags } from '@/lib/wordpress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MessageSquare, Tag as TagIcon, ArrowRight } from 'lucide-react';
import { decodeHtmlEntities } from '@/lib/utils';
import Image from 'next/image';

export async function BlogSidebar() {
    // Fetch data in parallel
    const [postsRes, comments, categories, tags] = await Promise.all([
        getPostsPaginated(1, 5),
        getRecentComments(5),
        getAllCategories(),
        getAllTags()
    ]);

    const recentPosts = postsRes.data;

    // Filter empty categories/tags if needed, usually WP returns all used ones or all.
    const activeCategories = categories.filter(c => c.count > 0);
    const activeTags = tags.filter(t => t.count > 0).slice(0, 15); // Limit tags

    return (
        <div className="space-y-8">
            {/* Latest Posts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-heading text-primary-950 dark:text-primary-50">Latest Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {recentPosts.map((post) => {
                        const postAny = post as any;
                        return (
                            <div key={post.id} className="group">
                                <Link href={`/blog/${post.slug}`} className="flex gap-4">
                                    {postAny._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={postAny._embedded['wp:featuredmedia'][0].source_url}
                                                alt={post.title.rendered}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 flex-shrink-0 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium text-sm text-neutral-800 dark:text-neutral-200 line-clamp-2 group-hover:text-primary-600 transition-colors mb-1">
                                            {decodeHtmlEntities(post.title.rendered)}
                                        </h4>
                                        <div className="flex items-center text-xs text-neutral-500 gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(post.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Categories */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-heading text-primary-950 dark:text-primary-50">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {activeCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/blog/category/${category.slug}`}
                                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 hover:text-primary-600 transition-colors"
                            >
                                <span className="text-sm font-medium">{category.name}</span>
                                <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Comments */}
            {comments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-heading text-primary-950 dark:text-primary-50">Recent Comments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 items-start text-sm">
                                <MessageSquare className="h-4 w-4 text-primary-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                        {comment.author_name} <span className="text-neutral-500 font-normal">on</span>
                                    </p>
                                    <div
                                        className="text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-0.5 text-xs italic"
                                        dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Tags */}
            {activeTags.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-heading text-primary-950 dark:text-primary-50">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {activeTags.map((tag) => (
                                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                                    <Badge variant="outline" className="hover:bg-accent cursor-pointer transition-colors">
                                        {tag.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
