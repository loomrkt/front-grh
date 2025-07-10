import { useRef } from "react";
import { Contact, Identity } from "@/models/types";

interface ProfileImageProps {
  isEditing: boolean;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      identity: Identity;
      contact: Contact;
      profileImage?: File | null;
    }>
  >;
}

const ProfileImage = ({
  isEditing,
  imagePreview,
  setImagePreview,
  setFormData,
}: ProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <>
      {isEditing ? (
        <>
          <input
            type="file"
            accept="image/*"
            id="profileImage"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <label htmlFor="profileImage">
            <div className="relative w-[100px] h-[100px] rounded-full bg-red-200 cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-red-200 flex items-center justify-center">
                  <span className="text-white">Upload</span>
                </div>
              )}
            </div>
          </label>
        </>
      ) : imagePreview ? (
        <img
          src={imagePreview}
          className="w-[100px] h-[100px] rounded-full object-cover"
        />
      ) : (
        <div className="w-[100px] h-[100px] rounded-full bg-red-200"></div>
      )}
    </>
  );
};

export default ProfileImage;