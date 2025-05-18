"use client"
import React, { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePostsStore } from '@/store/usePostsStore';
import { Grid, RefreshCw, Wrench, User, Camera, ExternalLink, Heart, Type, Pencil, Check, X, Loader2 } from 'lucide-react';
import ImageCropModal from '@/components/ImageCropModal';
import { uploadImage } from '../api/cloudinary';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  profile_picture_url?: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  created_at: string;
}

// Using Post type from the store instead of defining it here

// Mock user tools data
const mockUserTools: Tool[] = [
  {
    id: '1',
    name: 'Image Generator',
    description: 'Create stunning AI-generated images from text descriptions',
    icon: '/tool-icons/image-generator.jpg',
    url: 'https://example.com/image-generator',
    created_at: '2023-05-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Text Summarizer',
    description: 'Automatically summarize long articles and documents',
    icon: '/tool-icons/text-summarizer.jpg',
    url: 'https://example.com/text-summarizer',
    created_at: '2023-06-22T14:45:00Z'
  },
  {
    id: '3',
    name: 'Code Assistant',
    description: 'AI-powered coding assistant to help with programming tasks',
    icon: '/tool-icons/code-assistant.jpg',
    url: 'https://example.com/code-assistant',
    created_at: '2023-07-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'Voice Cloner',
    description: 'Clone voices and generate realistic speech in different languages',
    icon: '/tool-icons/voice-cloner.jpg',
    url: 'https://example.com/voice-cloner',
    created_at: '2023-08-05T16:20:00Z'
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState<UserProfile | null>(null);
  const { posts, loadUserPosts } = usePostsStore();
  const [userTools, setUserTools] = useState<Tool[]>(mockUserTools);
  const [loading, setLoading] = useState(true);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit mode states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Edited values
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedBio, setEditedBio] = useState('');

  // Saving states
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSavingBio, setIsSavingBio] = useState(false);

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

        // Initialize edit values
        if (userData) {
          setEditedUsername(userData.username);
          setEditedEmail(userData.email);
          setEditedBio(userData.bio || '');
        }

        // Fetch posts for the current user using the store
        await loadUserPosts(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchProfileAndPosts();
  }, [loadUserPosts]);

  // Handle editing username
  const handleEditUsername = () => {
    setIsEditingUsername(true);
  };

  // Handle editing email
  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  // Handle editing bio
  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  // Handle saving username
  const handleSaveUsername = async () => {
    if (!user) return;

    try {
      setIsSavingUsername(true);
      const supabase = createClientComponentClient();

      // Update username in users table
      const { error } = await supabase
        .from('users')
        .update({ username: editedUsername, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      // Update user state
      setUser({
        ...user,
        username: editedUsername
      });

      toast.success('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username');
    } finally {
      setIsSavingUsername(false);
      setIsEditingUsername(false);
    }
  };

  // Handle saving email
  const handleSaveEmail = async () => {
    if (!user) return;

    try {
      setIsSavingEmail(true);
      const supabase = createClientComponentClient();

      // Update email in auth
      const { error: authError } = await supabase.auth.updateUser({
        email: editedEmail,
      });

      if (authError) throw authError;

      // Update email in users table
      const { error: dbError } = await supabase
        .from('users')
        .update({ email: editedEmail, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (dbError) throw dbError;

      // Update user state
      setUser({
        ...user,
        email: editedEmail
      });

      toast.success('Email updated successfully. Verification email sent.');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Failed to update email');
    } finally {
      setIsSavingEmail(false);
      setIsEditingEmail(false);
    }
  };

  // Handle saving bio
  const handleSaveBio = async () => {
    if (!user) return;

    try {
      setIsSavingBio(true);
      const supabase = createClientComponentClient();

      // Update bio in users table
      const { error } = await supabase
        .from('users')
        .update({ bio: editedBio, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      // Update user state
      setUser({
        ...user,
        bio: editedBio
      });

      toast.success('Bio updated successfully');
    } catch (error) {
      console.error('Error updating bio:', error);
      toast.error('Failed to update bio');
    } finally {
      setIsSavingBio(false);
      setIsEditingBio(false);
    }
  };

  // Handle cancel editing
  const handleCancelUsername = () => {
    setIsEditingUsername(false);
    setEditedUsername(user?.username || '');
  };

  const handleCancelEmail = () => {
    setIsEditingEmail(false);
    setEditedEmail(user?.email || '');
  };

  const handleCancelBio = () => {
    setIsEditingBio(false);
    setEditedBio(user?.bio || '');
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async (croppedImage: Blob) => {
    try {
      setLoading(true);
      const supabase = createClientComponentClient();

      // Convert Blob to File
      const file = new File([croppedImage], 'profile-picture.jpg', { type: 'image/jpeg' });

      // Upload to Cloudinary
      const imageUrl = await uploadImage(file);

      // Update user profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({ profile_picture_url: imageUrl })
        .eq('id', user?.id);

      if (error) throw error;

      // Refresh user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      setUser(userData);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setLoading(false);
      setIsCropModalOpen(false);
      setSelectedImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center">
      {/* Gradient Header */}
      <div className="w-full max-w-5xl h-48 rounded-2xl mt-4 bg-gradient-to-r from-red-500 to-orange-400 relative flex items-start justify-end p-4">
        {/* The gradient can stay as is for visual pop, or you can use theme variables if you want a more neutral look */}
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-4xl bg-[var(--card)] rounded-2xl shadow-lg -mt-20 flex flex-col md:flex-row items-center md:items-end p-8 relative z-10 border border-[var(--border)]">
        {/* Avatar */}
        <div className="relative w-36 h-36 rounded-full border-4 border-[var(--background)] bg-[var(--muted)] flex items-center justify-center shadow-lg -mt-20 md:mt-0 md:-ml-20 overflow-hidden group">
          {user && user.profile_picture_url ? (
            <img src={user.profile_picture_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl text-[var(--muted-foreground)]">◎</span>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="w-8 h-8 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
        {/* Info */}
        <div className="flex-1 ml-0 md:ml-8 mt-6 md:mt-0">
          <div className="flex items-center gap-3">
            {isEditingUsername ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="text-3xl font-bold bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-1 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  onClick={handleSaveUsername}
                  disabled={isSavingUsername}
                  className="p-2 text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
                >
                  {isSavingUsername ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleCancelUsername}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center group">
                <h1 className="text-3xl font-bold">{user ? user.username : 'Unknown User'}</h1>
                <button
                  onClick={handleEditUsername}
                  className="p-2 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-[var(--primary)] transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}

            {isEditingEmail ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="bg-[var(--background)] text-[var(--primary)] px-3 py-1 rounded-lg text-sm font-mono border border-[var(--border)] focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  onClick={handleSaveEmail}
                  disabled={isSavingEmail}
                  className="p-2 text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
                >
                  {isSavingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleCancelEmail}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center group">
                <span className="bg-[var(--background)] bg-opacity-60 text-[var(--primary)] px-3 py-1 rounded-lg text-sm font-mono border border-[var(--border)]">{user ? user.email : ''}</span>
                <button
                  onClick={handleEditEmail}
                  className="p-2 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-[var(--primary)] transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {isEditingBio ? (
            <div className="mt-2 flex items-start gap-2">
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full bg-[var(--background)] text-[var(--foreground)] px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] min-h-[80px]"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSaveBio}
                  disabled={isSavingBio}
                  className="p-2 text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
                >
                  {isSavingBio ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleCancelBio}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 group flex items-start">
              <p className="text-[var(--muted-foreground)] max-w-xl">
                {user && user.bio ? user.bio : 'No bio provided.'}
              </p>
              <button
                onClick={handleEditBio}
                className="p-2 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-[var(--primary)] transition-all"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}

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
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'posts' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)]'}`}
            onClick={() => setActiveTab('posts')}
          >
            <Grid /> Posts
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'tools' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)]'}`}
            onClick={() => setActiveTab('tools')}
          >
            <Wrench /> Tools
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'tagged' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)]'}`}
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

      {/* Content Section */}
      {activeTab === 'posts' && (
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-4 pb-16">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-[var(--card)] rounded-xl flex flex-col overflow-hidden border border-[var(--border)] animate-pulse h-full">
                <div className="w-full aspect-video bg-[var(--muted)]"></div>
                <div className="p-4 flex flex-col flex-grow">
                  <div>
                    <div className="h-5 bg-[var(--muted)] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[var(--muted)] rounded w-full mb-2"></div>
                    <div className="h-4 bg-[var(--muted)] rounded w-1/2 mb-3"></div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-800">
                    <div className="h-3 bg-[var(--muted)] rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-[var(--card)] rounded-xl flex flex-col overflow-hidden border border-[var(--border)] relative h-full">
                {post.image_url ? (
                  <div className="w-full aspect-video">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-[var(--muted)] flex items-center justify-center">
                    <Type className="w-8 h-8 text-[var(--muted-foreground)]" />
                  </div>
                )}
                <div className="p-4 w-full flex flex-col flex-grow">
                  <div>
                    <div className="font-bold text-[var(--primary)] truncate">{post.title}</div>
                    <div className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">{post.description}</div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1">
                      <Heart className="w-4 h-4 mr-1 fill-current text-red-400" />
                      <span className="text-xs text-[var(--muted-foreground)]">{post.likes || 0} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-[var(--muted-foreground)]">No posts yet.</div>
          )}
        </div>
      )}

      {/* Tools Grid */}
      {activeTab === 'tools' && (
        <div className="w-full max-w-5xl mt-8 px-4 pb-16">
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold">Your Created Tools</h2>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {userTools.length > 0 ? (
                userTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <span className="text-[#1B2730] text-lg font-bold">{tool.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{tool.name}</div>
                        <div className="text-sm text-[var(--muted-foreground)] line-clamp-1">{tool.description}</div>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 rounded-full bg-[#1B2730] text-[var(--primary)] border border-[var(--border)] hover:border-gray-500 font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                      onClick={() => window.open(tool.url, '_blank')}
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--muted-foreground)]">
                  No tools created yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tagged Content (Placeholder) */}
      {activeTab === 'tagged' && (
        <div className="w-full max-w-5xl mt-8 px-4 pb-16 text-center">
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-8">
            <span className="text-[var(--muted-foreground)]">No tagged content yet.</span>
          </div>
        </div>
      )}

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => {
          setIsCropModalOpen(false);
          setSelectedImage(null);
        }}
        onSave={handleCropSave}
        imageUrl={selectedImage || ''}
      />
    </div>
  );
}
