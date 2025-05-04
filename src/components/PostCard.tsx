import { Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  id: string;
  username: string;
  userIcon: string;
  description: string;
  postImage?: string;
  postDate: string;
  userId: string;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export default function PostCard({
  id,
  username,
  userIcon,
  description,
  postImage,
  postDate,
  userId,
  onDelete,
  isDeleting
}: PostCardProps) {
  return (
    <div className="border border-secondary rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.03] p-5">
      <div className="flex justify-between items-start mb-3">
        <Link href={`/profile/${userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
            {userIcon ? (
              <Image
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

      <p className="text-primary mb-4 leading-relaxed break-words whitespace-pre-wrap">{description}</p>

      {postImage && (
        <div className="relative w-full h-64 rounded-md overflow-hidden mb-4 border-2 border-secondary">
          <Image
            src={postImage}
            alt="Post Image"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
} 