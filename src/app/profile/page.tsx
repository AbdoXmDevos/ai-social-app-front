"use client"
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePostsStore } from '@/store/usePostsStore';
import { Grid, RefreshCw, Bookmark, User } from 'lucide-react';
interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
}

// Using Post type from the store instead of defining it here

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState<UserProfile | null>(null);
  const { posts, loadUserPosts } = usePostsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      const supabase = createClientComponentClient();
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        // Fetch user profile
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(userData || null);

        // Fetch posts for the current user using the store
        await loadUserPosts(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchProfileAndPosts();
  }, [loadUserPosts]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center">
      {/* Gradient Header */}
      <div className="w-full max-w-5xl h-48 rounded-2xl mt-4 bg-gradient-to-r from-red-500 to-orange-400 relative flex items-start justify-end p-4">
        {/* The gradient can stay as is for visual pop, or you can use theme variables if you want a more neutral look */}
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-4xl bg-[var(--card)] rounded-2xl shadow-lg -mt-20 flex flex-col md:flex-row items-center md:items-end p-8 relative z-10 border border-[var(--border)]">
        {/* Avatar */}
        <div className="w-36 h-36 rounded-full border-4 border-[var(--background)] bg-[var(--muted)] flex items-center justify-center shadow-lg -mt-20 md:mt-0 md:-ml-20 overflow-hidden">
          {user && user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl text-[var(--muted-foreground)]">◎</span>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 ml-0 md:ml-8 mt-6 md:mt-0">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{user ? user.username : 'Unknown User'}</h1>
            <span className="bg-[var(--background)] bg-opacity-60 text-[var(--primary)] px-3 py-1 rounded-lg text-sm font-mono border border-[var(--border)]">{user ? user.email : ''}</span>
          </div>
          <p className="mt-2 text-[var(--muted-foreground)] max-w-xl">
            {user && user.bio ? user.bio : 'No bio provided.'}
          </p>
          <div className="flex gap-8 mt-4 text-center">
            <div>
              <div className="font-bold text-lg">{posts.length}</div>
              <div className="text-[var(--muted-foreground)] text-sm">Posts</div>
            </div>
          </div>
        </div>
        {/* Actions */}
        
      </div>

      {/* Tabs */}
      <div className="w-full max-w-3xl flex justify-center mt-8">
        <div className="bg-[var(--card)] rounded-xl flex p-1 gap-2 border border-[var(--border)]">
          <button
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'posts' ? 'bg-[var(--secondary)] text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}
            onClick={() => setActiveTab('posts')}
          >
            <Grid /> Posts
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'saved' ? 'bg-[var(--secondary)] text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark /> Saved
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'tagged' ? 'bg-[var(--secondary)] text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}
            onClick={() => setActiveTab('tagged')}
          >
            <User /> Tagged
          </button>
        </div>
        <div className="flex flex-col gap-2 ml-0 md:ml-8 mt-6 md:mt-0  py-2">
          <button
            className="bg-[var(--primary)] hover:bg-[var(--primary)] hover:opacity-50 text-[var(--primary-foreground)] px-2 py-2 rounded-lg font-semibold flex items-center gap-2"
            onClick={async () => {
              if (user?.id) {
                setLoading(true);
                await loadUserPosts(user.id);
                setLoading(false);
              }
            }}
          >
            <RefreshCw />
          </button>
          </div>
      </div>

      {/* Posts Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 px-4 pb-16">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-[var(--muted)] rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-[var(--muted-foreground)] text-4xl">✖</span>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="aspect-square bg-[var(--card)] rounded-xl flex flex-col items-center justify-center overflow-hidden border border-[var(--border)]">
              {post.image_url ? (
                <img src={post.image_url} alt={post.title} className="w-full h-2/3 object-cover" />
              ) : (
                <span className="text-[var(--muted-foreground)] text-4xl">✖</span>
              )}
              <div className="p-2 w-full">
                <div className="font-bold text-[var(--primary)] truncate">{post.title}</div>
                <div className="text-xs text-[var(--muted-foreground)] truncate">{post.description}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-[var(--muted-foreground)]">No posts yet.</div>
        )}
      </div>
    </div>
  );
}
