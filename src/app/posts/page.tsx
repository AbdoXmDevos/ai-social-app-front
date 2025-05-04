'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePostsStore } from '@/store/usePostsStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CircleX, Delete, Image, Loader2, Trash } from 'lucide-react';
import { uploadImage } from '../api/cloudinary';
import { Shimmer } from '@/components/ui/shimmer';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PostCard from '@/components/PostCard';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 10MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function PostsPage() {
    const { posts, loadPosts, addPost, removePost, hasMore, currentPage } = usePostsStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver>();

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
                console.log('Current user ID:', session.user.id);
                await loadPosts(1);
            } else {
                console.log('No user logged in');
                await loadPosts(1);
            }
            setIsLoading(false);
        };

        fetchUserAndPosts();
    }, [loadPosts]);

    function validateFile(file: File): boolean {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            toast.error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size too large. Maximum size is 10MB.');
            return false;
        }

        return true;
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            } else {
                // Reset the file input
                e.target.value = '';
                setFile(null);
            }
        }
    }

    async function handleCreatePost() {
        try {
            setIsCreating(true);
            console.log('Starting post creation...');
            console.log('File state:', file);
            let imageUrl: string | undefined;
            if (file) {
                if (!validateFile(file)) {
                    return;
                }
                console.log('Attempting to upload image to Cloudinary...');
                try {
                    imageUrl = await uploadImage(file);
                    console.log('Image upload response:', imageUrl);
                } catch (uploadError) {
                    console.error('Error uploading to Cloudinary:', uploadError);
                    toast.error('Failed to upload image. Please try again.');
                    throw uploadError;
                }
            } else {
                console.log('No file selected for upload');
            }
            const supabase = createClientComponentClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user?.id) {
                toast.error('You must be logged in to create a post');
                return;
            }

            const userId = session.user.id.toString();
            console.log('Creating post with data:', { title, description, imageUrl, userId });
            await addPost(title, description, imageUrl ?? '', userId);
            console.log('Post created successfully');
            toast.success('Post created successfully!');
            setTitle('');
            setDescription('');
            setFile(null);
        } catch (err) {
            console.error('Error in handleCreatePost:', err);
            toast.error('Failed to create post. Please try again.');
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeletePost(postId: string) {
        try {
            setDeletingPostId(postId);
            await removePost(postId);
        } catch (err) {
            console.error('Error deleting post:', err);
        } finally {
            setDeletingPostId(null);
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-6 text-primary">Create a Post</h1>
            <div className="space-y-4 mb-8">
                <div className="bg-card p-4 rounded-lg border border-secondary shadow mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-secondary" />

                        {/* Input */}
                        <Input
                            placeholder="What's new, Abdo?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="flex-1 bg-background text-primary placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="border-t border-secondary pt-4 flex justify-between items-center">
                        {/* Left side - Photo/Video Button and Preview */}
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                    <Image width={20} height={20} className="text-primary"/>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    title="Upload Image"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleFileChange}
                                />
                            </label>

                            {/* Show preview if file selected */}
                            {file && (
                                <div className="flex items-center gap-3 p-2 border border-secondary rounded-md bg-card shadow-sm">
                                    {/* Small thumbnail */}
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                                    />
                                    {/* File info */}
                                    <div className="flex flex-col text-sm text-primary truncate">
                                        <span className="font-semibold max-w-[200px] truncate">{file.name}</span>
                                        <span className="text-muted-foreground">{file.type}</span>
                                    </div>
                                    {/* Remove file button */}
                                    <CircleX
                                        className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                                        onClick={() => setFile(null)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right side - Post Button */}
                        <Button
                            onClick={handleCreatePost}
                            disabled={!description.trim() && !file || isCreating}
                            className="ml-auto bg-secondary hover:bg-secondary/80 text-primary"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                'Post'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Posts</h2>
            <div className="space-y-4">
                {isLoading && currentPage === 1 ? (
                    // Loading shimmer
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="border border-secondary rounded-lg bg-card p-5">
                            <div className="flex justify-between items-start mb-3">
                                <Shimmer className="h-8 w-3/4 rounded" />
                                <Shimmer className="h-8 w-8 rounded-full" />
                            </div>
                            <Shimmer className="h-4 w-full rounded mb-2" />
                            <Shimmer className="h-4 w-2/3 rounded mb-4" />
                            <Shimmer className="h-48 w-full rounded mb-4" />
                            <Shimmer className="h-4 w-1/4 rounded ml-auto" />
                        </div>
                    ))
                ) : posts.length === 0 ? (
                    <p className="text-muted-foreground">No posts yet. Create one!</p>
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
                                    onDelete={handleDeletePost}
                                    isDeleting={deletingPostId === post.id}
                                />
                            </div>
                        );
                    })
                )}
                {isLoading && currentPage > 1 && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                )}
            </div>
        </div>
    );
}
