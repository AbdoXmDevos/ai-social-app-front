import { create } from 'zustand';
import { Post, fetchPosts, createPost, deletePost } from '@/app/api/posts';

type PostsStore = {
  posts: Post[];
  loadPosts: () => Promise<void>;
  addPost: (title: string, description: string, imageUrl: string) => Promise<void>;
  removePost: (id: string) => Promise<void>;
};

export const usePostsStore = create<PostsStore>((set) => ({
  posts: [],

  loadPosts: async () => {
    const data = await fetchPosts();
    set({ posts: data });
  },

  addPost: async (title, description, imageUrl) => {
    await createPost(title, description, imageUrl);
    const data = await fetchPosts();
    set({ posts: data });
  },

  removePost: async (id) => {
    await deletePost(id);
    const data = await fetchPosts();
    set({ posts: data });
  }
  
}));
