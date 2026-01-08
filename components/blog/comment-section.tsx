import { getCommentsByPostId } from '@/lib/wordpress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface CommentSectionProps {
    postId: number;
}

export async function CommentSection({ postId }: CommentSectionProps) {
    let comments: any[] = [];
    try {
        comments = await getCommentsByPostId(postId);
    } catch (error) {
        console.error(`Failed to fetch comments for post ${postId}`, error);
    }

    return (
        <div className="space-y-8" id="comments">
            <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-heading font-bold text-primary-950 dark:text-primary-50">
                    Comments ({comments.length})
                </h3>
                <span className="h-px bg-border flex-1" />
            </div>

            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-10 bg-muted/30 rounded-lg border border-border/50">
                        <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground font-medium">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment.id} className="border-border/50 bg-background/50 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center">
                                        {comment.author_avatar_urls?.['96'] ? (
                                            <Image
                                                src={comment.author_avatar_urls['96']}
                                                alt={comment.author_name}
                                                width={40}
                                                height={40}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-bold text-muted-foreground">{comment.author_name.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-sm text-foreground">{comment.author_name}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                                Reply
                                            </Button>
                                        </div>
                                        <div
                                            className="text-sm text-neutral-700 dark:text-neutral-300 prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Comment Form Placeholder */}
            <div className="mt-10 p-6 bg-muted/30 rounded-xl border border-border/50">
                <h4 className="text-lg font-bold mb-4">Leave a Comment</h4>
                <p className="text-sm text-muted-foreground mb-6">
                    Your email address will not be published. Required fields are marked *
                </p>
                <Button disabled className="w-full sm:w-auto">
                    Post Comment (Login Required)
                </Button>
            </div>
        </div>
    );
}
