
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
};

// Create a post
export async function createPost(title: string, description: string, imageUrl?: string) {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, description, image_url: imageUrl }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

// Fetch all posts
export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  return data;
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