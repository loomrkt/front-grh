import { useRef, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfileImage } from "@/services/employe";

interface ProfileImageProps {
  userId?: string; // Optional for creation mode
  initialImage?: string;
  onFileChange?: (file: File | null) => void; // For creation mode
  onSuccess?: (newImageUrl: string) => void;
  onError?: (error: Error) => void;
}

const ProfileImage = ({ 
  userId, 
  initialImage, 
  onFileChange,
  onSuccess, 
  onError 
}: ProfileImageProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(!initialImage);
  
  // Determine if we're in creation mode
  const isCreationMode = !userId;

  // Mutation only for edit mode
  const updateImageMutation = useMutation({
    mutationFn: (file: File) => {
      if (!userId) throw new Error("User ID is required for update");
      return updateProfileImage(userId, file);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      
      setIsEditing(false);
      setLocalFile(null);
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      setImagePreview(initialImage || null);
      setLocalFile(null);
      onError?.(error);
    },
  });

  useEffect(() => {
    setImagePreview(initialImage || null);
    if (initialImage) {
      setIsEditing(false);
    }
  }, [initialImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setLocalFile(file);

      // Different behavior based on mode
      if (isCreationMode) {
        // Creation mode: notify parent
        onFileChange?.(file);
      } else if (!initialImage) {
        // Edit mode without initial image: save immediately
        updateImageMutation.mutate(file);
      }
    } else {
      // Handle file removal
      setImagePreview(initialImage || null);
      setLocalFile(null);
      if (isCreationMode) onFileChange?.(null);
    }
  };

  const toggleEdit = () => {
    if (updateImageMutation.isPending) return;
    setIsEditing(true);
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (localFile) {
      updateImageMutation.mutate(localFile);
    }
  };

  const handleCancel = () => {
    setImagePreview(initialImage || null);
    setLocalFile(null);
    setIsEditing(false);
    
    if (imagePreview && imagePreview !== initialImage) {
      URL.revokeObjectURL(imagePreview);
    }
    
    // Notify parent in creation mode
    if (isCreationMode) onFileChange?.(null);
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== initialImage && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, initialImage]);

  const isLoading = updateImageMutation.isPending;

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        id="profileImage"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isLoading}
      />

      <div className="w-fit h-fit relative">
        <div
          className={`relative w-[100px] h-[100px] rounded-full bg-gray-200 overflow-hidden ${
            (isEditing || isCreationMode) && !isLoading ? 'cursor-pointer' : 'cursor-default'
          } ${isLoading ? 'opacity-70' : ''}`}
          onClick={() => (isEditing || isCreationMode) && !isLoading && fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 rounded-full text-sm">
              Upload
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!isCreationMode && initialImage && !isEditing && !isLoading && (
          <Button
            variant="default"
            size="icon"
            className="absolute bottom-0 right-0 z-50 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              toggleEdit();
            }}
            aria-label="Edit profile image"
          >
            <Edit size={16} />
          </Button>
        )}

        {(isEditing || isCreationMode) && !isLoading && initialImage && (
          <div className="absolute bottom-0 right-0 z-50 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleCancel}
              aria-label="Cancel edit"
            >
              ✕
            </Button>
            {!isCreationMode && (
              <Button
                variant="default"
                size="icon"
                className="rounded-full"
                onClick={handleSave}
                disabled={!localFile}
                aria-label="Save profile image"
              >
                <Save size={16} />
              </Button>
            )}
          </div>
        )}
      </div>

      {updateImageMutation.isError && (
        <div className="mt-2 text-sm text-red-600">
          Error updating image
        </div>
      )}
    </div>
  );
};

export default ProfileImage;