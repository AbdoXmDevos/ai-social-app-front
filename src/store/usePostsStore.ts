import { create } from 'zustand';
import { Post, fetchPosts, createPost, deletePost, updatePost as updatePostApi, toggleLike as toggleLikeApi } from '@/app/api/posts';
import { useAuthStore } from './useAuthStore';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type PostsStore = {
  posts: Post[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  loadPosts: (page?: number) => Promise<void>;
  loadUserPosts: (userId: string) => Promise<void>;
  addPost: (title: string, description: string, imageUrl: string, userId: string) => Promise<void>;
  removePost: (id: string) => Promise<void>;
  updatePost: (id: string, description: string, imageUrl: string) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  resetPosts: () => void;
};

export const usePostsStore = create<PostsStore>((set, get) => ({
  posts: [],
  totalCount: 0,
  hasMore: false,
  currentPage: 1,

  loadPosts: async (page = 1) => {
    const { posts: data, totalCount, hasMore } = await fetchPosts(undefined, page);
    set({ 
      posts: page === 1 ? data : [...get().posts, ...data],
      totalCount,
      hasMore,
      currentPage: page
    });
  },

  loadUserPosts: async (userId: string) => {
    const { posts: data } = await fetchPosts(userId);
    set({ posts: data, currentPage: 1 });
  },

  addPost: async (title, description, imageUrl, userId) => {
    const supabase = createClientComponentClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    await createPost(title, description, imageUrl, userId);
    // Reload first page after creating a new post
    const { posts: data, totalCount, hasMore } = await fetchPosts(undefined, 1);
    set({ posts: data, totalCount, hasMore, currentPage: 1 });
  },

  removePost: async (id) => {
    await deletePost(id);
    // Reload current page after deletion
    const { currentPage } = get();
    const { posts: data, totalCount, hasMore } = await fetchPosts(undefined, currentPage);
    set({ posts: data, totalCount, hasMore });
  },

  updatePost: async (id, description, imageUrl) => {
    await updatePostApi(id, description, imageUrl);
    // Reload current page after update
    const { currentPage } = get();
    const { posts: data, totalCount, hasMore } = await fetchPosts(undefined, currentPage);
    set({ posts: data, totalCount, hasMore });
  },

  toggleLike: async (postId, userId) => {
    await toggleLikeApi(postId, userId);
    // Update the post's likes count in the store
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + (post.likes === 0 ? 1 : -1)
          };
        }
        return post;
      })
    }));
  },

  resetPosts: () => {
    set({ posts: [], totalCount: 0, hasMore: false, currentPage: 1 });
  }
}));
