import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '@/app/api/cloudinary';
import MarkdownEditor from './MarkdownEditor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (description: string, imageUrl: string) => Promise<void>;
  currentUser: any;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onCreatePost,
  currentUser
}: CreatePostModalProps) {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const editorRef = useRef<{ resetHeight: () => void }>(null);

  function validateFile(file: File): boolean {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size too large. Maximum size is 5MB.');
      return false;
    }

    return true;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImageUrl(e.target.result as string);
          }
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Reset the file input
        e.target.value = '';
        setFile(null);
      }
    }
  };

  const handleCreatePost = async () => {
    try {
      setIsCreating(true);
      let finalImageUrl = '';
      
      if (file) {
        if (!validateFile(file)) {
          setIsCreating(false);
          return;
        }
        try {
          finalImageUrl = await uploadImage(file);
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          toast.error('Failed to upload image. Please try again.');
          setIsCreating(false);
          return;
        }
      }

      await onCreatePost(description, finalImageUrl);
      
      // Reset form
      setDescription('');
      setFile(null);
      setImageUrl('');
      
      // Reset the textarea height
      if (editorRef.current) {
        editorRef.current.resetHeight();
      }
      
      onClose();
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1B2730] p-6 rounded-xl w-full max-w-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Create Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
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

            {/* Input */}
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              placeholder="What's happening? *Markdown* is **supported**!"
              className="flex-1"
              minHeight="100px"
              editorRef={editorRef}
            />
          </div>

          {/* Show preview if file selected */}
          {imageUrl && (
            <div className="mb-4 relative">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-80 object-cover rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-colors"
                onClick={() => {
                  setFile(null);
                  setImageUrl('');
                }}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center">
            {/* Media buttons */}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#1a1e23] transition-colors">
                  <ImageIcon className="w-5 h-5 text-[#1d9bf0]" />
                </div>
                <input
                  type="file"
                  className="hidden"
                  title="Upload Image"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose} className="rounded-full cursor-pointer border-gray-700 text-white hover:bg-gray-700">
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePost} 
            disabled={!description.trim() && !file || isCreating}
            className="rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white cursor-pointer font-bold px-5 py-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
