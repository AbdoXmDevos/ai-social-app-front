import { Trash, Loader2, Heart, MessageCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="border border-secondary rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow duration-300 p-5">
      <div className="flex justify-between items-start mb-3">
        <Link href={`/profile/${userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
            {userIcon ? (
              <NextImage
                src={userIcon}
                alt={username}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">{username}</h3>
            <p className="text-xs text-muted-foreground">{new Date(postDate).toLocaleString()}</p>
          </div>
        </Link>
        {isCreator && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-secondary transition-colors rounded-full"
              onClick={() => setIsEditModalOpen(true)}
              aria-label="Edit post"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                className="p-2 hover:bg-red-700 transition-colors rounded-full"
                onClick={() => onDelete(id)}
                disabled={isDeleting}
                aria-label="Delete post"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <p className="text-primary mb-4 leading-relaxed break-words whitespace-pre-wrap">{description}</p>

      {postImage && (
        <div className="relative w-full aspect-auto rounded-md overflow-hidden mb-4 border-2 border-secondary">
          <NextImage
            src={postImage}
            alt="Post Image"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
          />
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-secondary">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </Button>
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