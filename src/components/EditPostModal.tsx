import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/app/api/cloudinary';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (description: string, imageUrl: string) => void;
  initialDescription: string;
  initialImageUrl?: string;
}

export default function EditPostModal({
  isOpen,
  onClose,
  onSave,
  initialDescription,
  initialImageUrl
}: EditPostModalProps) {
  const [description, setDescription] = useState(initialDescription);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = await uploadImage(selectedFile);
      setImageUrl(url);
    }
  };

  const handleSave = () => {
    onSave(description, imageUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">Edit Post</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            {imageUrl && (
              <div className="relative w-20 h-20">
                <img
                  src={imageUrl}
                  alt="Post preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => {
                    setImageUrl('');
                    setFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
} 