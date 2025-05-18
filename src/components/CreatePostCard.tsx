import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle } from 'lucide-react';

interface CreatePostCardProps {
  onClick: () => void;
  currentUser: any;
}

export default function CreatePostCard({ onClick, currentUser }: CreatePostCardProps) {
  return (
    <div 
      className="bg-[#1B2730] p-4 rounded-lg border border-gray shadow mb-8 cursor-pointer hover:border-[#1d9bf0] transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
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

        {/* Placeholder input */}
        <div className="flex-1 bg-[#253440] rounded-full px-4 py-3 text-gray-400">
          What's happening?
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2 text-[#1d9bf0] font-medium">
          <PlusCircle className="w-5 h-5" />
          <span>Create Post</span>
        </div>
      </div>
    </div>
  );
}
