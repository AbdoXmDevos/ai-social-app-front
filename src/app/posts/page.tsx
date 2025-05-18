'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePostsStore } from '@/store/usePostsStore';
import { Loader2 } from 'lucide-react';
import { Shimmer } from '@/components/ui/shimmer';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PostCard from '@/components/PostCard';
import SuggestedTools from '@/components/SuggestedTools';
import { PostDeletedNotification } from '@/components/DeletePostConfirmation';
import CreatePostCard from '@/components/CreatePostCard';
import CreatePostModal from '@/components/CreatePostModal';



export default function PostsPage() {
    const { posts, loadPosts, addPost, removePost, updatePost, hasMore, currentPage } = usePostsStore();
    const [isLoading, setIsLoading] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [showDeletedNotification, setShowDeletedNotification] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadPosts(currentPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, currentPage, loadPosts]);

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            setIsLoading(true);
            const supabase = createClientComponentClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user?.id) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setCurrentUser(userData);
                console.log('Current user:', userData);
                await loadPosts(1);
            } else {
                console.log('No user logged in');
                await loadPosts(1);
            }
            setIsLoading(false);
        };

        fetchUserAndPosts();
    }, [loadPosts]);

    async function handleCreatePost(description: string, imageUrl: string) {
        try {
            const supabase = createClientComponentClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user?.id) {
                toast.error('You must be logged in to create a post');
                return;
            }

            const userId = session.user.id.toString();
            console.log('Creating post with data:', { description, imageUrl, userId });
            await addPost('', description, imageUrl, userId);
            console.log('Post created successfully');
            toast.success('Post created successfully!');
        } catch (err) {
            console.error('Error in handleCreatePost:', err);
            toast.error('Failed to create post. Please try again.');
            throw err;
        }
    }

    async function handleDeletePost(postId: string) {
        try {
            setDeletingPostId(postId);
            await removePost(postId);

            // Show notification and scroll to top
            setShowDeletedNotification(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error('Error deleting post:', err);
            toast.error('Failed to delete post. Please try again.');
        } finally {
            setDeletingPostId(null);
        }
    }

    async function handleEditPost(postId: string, newDescription: string, newImageUrl: string) {
        try {
            await updatePost(postId, newDescription, newImageUrl);
            toast.success('Post updated successfully!');
        } catch (err) {
            console.error('Error updating post:', err);
            toast.error('Failed to update post. Please try again.');
        }
    }

    return (
        <div className="max-w-7xl mx-auto mt-10 p-4">
            <PostDeletedNotification
                isVisible={showDeletedNotification}
                onClose={() => setShowDeletedNotification(false)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main content - Posts */}
                <div className="md:col-span-2 space-y-4">
                    <CreatePostCard
                        onClick={() => setIsCreateModalOpen(true)}
                        currentUser={currentUser}
                    />

                    <div className="space-y-4">
                        {isLoading && currentPage === 1 ? (
                            // Loading shimmer
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="border border-gray-800 rounded-lg bg-[#0f1419] p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <Shimmer className="h-8 w-3/4 rounded bg-gray-800" />
                                        <Shimmer className="h-8 w-8 rounded-full bg-gray-800" />
                                    </div>
                                    <Shimmer className="h-4 w-full rounded mb-2 bg-gray-800" />
                                    <Shimmer className="h-4 w-2/3 rounded mb-4 bg-gray-800" />
                                    <Shimmer className="h-48 w-full rounded mb-4 bg-gray-800" />
                                    <Shimmer className="h-4 w-1/4 rounded ml-auto bg-gray-800" />
                                </div>
                            ))
                        ) : posts.length === 0 ? (
                            <div className="border border-gray-800 rounded-lg bg-[#0f1419] p-8 text-center">
                                <p className="text-gray-400">No posts yet. Create one above!</p>
                            </div>
                        ) : (
                            posts.map((post, index) => {
                                const username = post.users?.username || 'Unknown User';
                                const userIcon = post.users?.profile_picture_url || '';
                                const isLastElement = index === posts.length - 1;

                                return (
                                    <div
                                        key={post.id}
                                        ref={isLastElement ? lastPostElementRef : undefined}
                                    >
                                        <PostCard
                                            id={post.id}
                                            username={username}
                                            userIcon={userIcon}
                                            description={post.description}
                                            postImage={post.image_url}
                                            postDate={post.created_at}
                                            userId={post.user_id}
                                            likes={post.likes || 0}
                                            onDelete={handleDeletePost}
                                            isDeleting={deletingPostId === post.id}
                                            onEdit={handleEditPost}
                                        />
                                    </div>
                                );
                            })
                        )}
                        {isLoading && currentPage > 1 && (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="hidden md:block space-y-4 relative min-h-screen">
                    <SuggestedTools />
                </div>
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreatePost={handleCreatePost}
                currentUser={currentUser}
            />
        </div>
    );
}
