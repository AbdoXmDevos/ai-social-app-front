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
  likes: number;
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

// Update a post
export async function updatePost(id: string, description: string, imageUrl: string) {
    const { data, error } = await supabase
      .from('posts')
      .update({ description, image_url: imageUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
}

// Toggle like for a post
export async function toggleLike(postId: string, userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // First, get the current user's liked_posts
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('liked_posts')
    .eq('id', userId)
    .single();

  if (userError) {
    throw userError;
  }

  const likedPosts = userData.liked_posts || [];
  const isLiked = likedPosts.includes(postId);

  // Update the user's liked_posts
  const newLikedPosts = isLiked
    ? likedPosts.filter((id: string) => id !== postId)
    : [...likedPosts, postId];

  const { error: updateUserError } = await supabase
    .from('users')
    .update({ liked_posts: newLikedPosts })
    .eq('id', userId);

  if (updateUserError) {
    throw updateUserError;
  }

  // Get current likes count
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select('likes')
    .eq('id', postId)
    .single();

  if (postError) {
    throw postError;
  }

  const currentLikes = postData?.likes || 0;
  const newLikes = currentLikes + (isLiked ? -1 : 1);

  // Update the post's likes count
  const { error: updatePostError } = await supabase
    .from('posts')
    .update({ likes: newLikes })
    .eq('id', postId);

  if (updatePostError) {
    throw updatePostError;
  }

  return !isLiked;
}