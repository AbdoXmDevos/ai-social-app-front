import { Trash, Loader2, Heart, MessageCircle, Pencil, Share, Repeat2 } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import EditPostModal from './EditPostModal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toggleLike } from '@/app/api/posts';
import { toast } from 'sonner';

interface PostCardProps {
  id: string;
  username: string;
  userIcon: string;
  description: string;
  postImage?: string;
  postDate: string;
  userId: string;
  likes: number;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  onEdit?: (id: string, description: string, imageUrl: string) => void;
}

export default function PostCard({
  id,
  username,
  userIcon,
  description,
  postImage,
  postDate,
  userId,
  likes,
  onDelete,
  isDeleting,
  onEdit
}: PostCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);

  // Get current user ID and liked status on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClientComponentClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.id) {
        setCurrentUserId(session.user.id);

        // Check if the post is liked by the current user
        const { data: userData } = await supabase
          .from('users')
          .select('liked_posts')
          .eq('id', session.user.id)
          .single();

        if (userData?.liked_posts) {
          setIsLiked(userData.liked_posts.includes(id));
        }
      }
    };

    fetchUserData();
  }, [id]);

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error('Please log in to like posts');
      return;
    }

    try {
      setIsLiking(true);
      const newLikeStatus = await toggleLike(id, currentUserId);
      setIsLiked(newLikeStatus);
      setLikesCount(prev => newLikeStatus ? prev + 1 : prev - 1);
    } catch (error: any) {
      console.error('Error toggling like:', error?.message || error);
      toast.error(error?.message || 'Failed to update like status');
      // Revert the UI state if the operation failed
      setIsLiked(prev => !prev);
      setLikesCount(prev => prev);
    } finally {
      setIsLiking(false);
    }
  };

  const isCreator = currentUserId === userId;

  return (
    <div className="border border-gray rounded-lg bg-[#1B2730] shadow-md hover:shadow-lg transition-shadow duration-300 p-5">
      <div className="flex justify-between items-start mb-3">
        <Link href={`/profile/${userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
            {userIcon ? (
              <NextImage
                src={userIcon}
                alt={username}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{username}</h3>
            <p className="text-xs text-gray-400">{new Date(postDate).toLocaleString()}</p>
          </div>
        </Link>
        {isCreator && (
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors rounded-full"
              onClick={() => setIsEditModalOpen(true)}
              aria-label="Edit post"
            >
              <Pencil className="w-5 h-5" />
            </button>
            {onDelete && (
              <button
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-full"
                onClick={() => onDelete(id)}
                disabled={isDeleting}
                aria-label="Delete post"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                ) : (
                  <Trash className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-white mb-4 leading-relaxed break-words whitespace-pre-wrap">{description}</p>

      {postImage && (
        <div className="relative w-full aspect-auto rounded-xl overflow-hidden mb-4 border border-gray-800">
          <NextImage
            src={postImage}
            alt="Post Image"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''} transition-all group-hover:scale-110`} />
            </div>
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 group transition-colors">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <MessageCircle className="w-5 h-5 transition-all group-hover:scale-110" />
            </div>
            <span className="text-sm font-medium">Comment</span>
          </button>

          
        </div>
      </div>

      {onEdit && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(newDescription, newImageUrl) => onEdit(id, newDescription, newImageUrl)}
          initialDescription={description}
          initialImageUrl={postImage}
        />
      )}
    </div>
  );
}