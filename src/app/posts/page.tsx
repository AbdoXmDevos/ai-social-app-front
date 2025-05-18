'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePostsStore } from '@/store/usePostsStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CircleX, Image as ImageIcon, Loader2, Trash } from 'lucide-react';
import { uploadImage } from '../api/cloudinary';
import { Shimmer } from '@/components/ui/shimmer';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PostCard from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SuggestedTools from '@/components/SuggestedTools';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 10MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function PostsPage() {
    const { posts, loadPosts, addPost, removePost, updatePost, hasMore, currentPage } = usePostsStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main content - Posts */}
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-[#1B2730] p-4 rounded-lg border border-gray shadow mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            {/* Avatar */}
                            <Avatar className="w-10 h-10 border border-gray-700">
                                {currentUser?.profile_picture_url ? (
                                    <AvatarImage
                                        src={currentUser.profile_picture_url}
                                        alt={currentUser.username || 'User'}
                                    />
                                ) : (
                                    <AvatarFallback className="bg-gray-700 text-white">
                                        {(currentUser?.username || 'U').charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            {/* Input */}
                            <Textarea
                                placeholder="What's happening?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="flex-1 bg-transparent border-none text-white placeholder:text-gray-500 resize-none min-h-[48px] max-h-[200px] overflow-y-auto focus:ring-0 focus:outline-none"
                                style={{ height: 'auto' }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                            />
                        </div>

                        {/* Show preview if file selected */}
                        {file && (
                            <div className="mb-4 relative">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full max-h-80 object-cover rounded-lg"
                                />
                                <button
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-colors"
                                    onClick={() => setFile(null)}
                                >
                                    <CircleX className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            {/* Media buttons */}
                            <div className="flex items-center gap-2">
                                <label className="cursor-pointer">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#1a1e23] transition-colors">
                                        <ImageIcon className="w-5 h-5 text-[#1d9bf0]" />
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        title="Upload Image"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>

                            {/* Post Button */}
                            <Button
                                onClick={handleCreatePost}
                                disabled={!description.trim() && !file || isCreating}
                                className="rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold px-5 py-2"
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
        </div>
    );
}
