import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type Post = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  users?: {
    username: string;
    profile_picture_url?: string;
  };
};

// Create a post
export async function createPost(title: string, description: string, imageUrl: string, userId: string) {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, description, image_url: imageUrl, user_id: userId }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

// Fetch all posts
export async function fetchPosts(userId?: string, page?: number, pageSize: number = 5) {
  const currentPage = page || 1;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('posts')
    .select(`
      *,
      users!user_id (
        username,
        profile_picture_url
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  // If userId is provided, filter posts by that user
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    posts: data,
    totalCount: count || 0,
    hasMore: count ? from + pageSize < count : false
  };
}

// Delete a post
export async function deletePost(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }