"use client";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import ProfileImage from "./ProfileImage";
import UserInfo from "./UserInfo";
import GeneralInfo from "./GeneralInfo";
import { Identity, Contact } from "@/models/types";

enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

interface UserCardProps {
  identity: Identity | null;
  contact: Contact | null;
}

const UserCard = ({ identity, contact }: UserCardProps) => {
  const [isEditing, setIsEditing] = useState(!identity || !contact); // Start in editing mode if either is null (creation)
  const [formData, setFormData] = useState<{
    identity: Identity;
    contact: Contact;
    profileImage?: File | null;
  }>({
    identity: identity || {
      firstName: "",
      lastName: "",
      profil: undefined, // Use undefined to match Identity interface
      gender: Gender.Other, // Default to a valid Gender enum value
      civility: "",
      birthDate: "",
      birthPlace: "",
      nationality: "",
    },
    contact: {
      phoneNumber: contact?.phoneNumber.length ? contact.phoneNumber : [""],
      email: contact?.email.length ? contact.email : [""],
    },
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    identity?.profil?.url || null
  );

  const handleIdentityChange = (field: keyof Identity, value: string) => {
    setFormData((prev) => ({
      ...prev,
      identity: { ...prev.identity, [field]: value },
    }));
  };

  const handleContactChange = (
    field: keyof Contact,
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: prev.contact[field].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const handleSave = () => {
    console.log(identity && contact ? "Données sauvegardées :" : "Données créées :", {
      ...formData,
      profileImage: formData.profileImage
        ? formData.profileImage.name
        : "No file selected",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      identity: identity || {
        firstName: "",
        lastName: "",
        profil: undefined, // Use undefined to match Identity interface
        gender: Gender.Other, // Default to a valid Gender enum value
        civility: "",
        birthDate: "",
        birthPlace: "",
        nationality: "",
      },
      contact: {
        phoneNumber: contact?.phoneNumber.length ? contact.phoneNumber : [""],
        email: contact?.email.length ? contact.email : [""],
      },
      profileImage: null,
    });
    setImagePreview(identity?.profil?.url || null);
    setIsEditing(false);
  };

  return (
    <div className="w-fit flex flex-col items-center p-4 overflow-scroll h-full">
      <ProfileImage
        isEditing={isEditing}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setFormData={setFormData}
      />
      <UserInfo
        isEditing={isEditing}
        formData={formData}
        handleIdentityChange={handleIdentityChange}
        handleContactChange={handleContactChange}
      />
      <div className="mt-4 flex justify-between items-center gap-5">
        <h2 className="text-lg font-semibold">
          {identity && contact ? "Information générale" : "Nouvelle information"}
        </h2>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <GeneralInfo
        isEditing={isEditing}
        formData={formData}
        handleIdentityChange={handleIdentityChange}
      />
    </div>
  );
};

export default UserCard;