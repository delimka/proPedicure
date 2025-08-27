"use client";

import React, { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { User } from "@supabase/supabase-js";

interface Photo {
  id: string;
  image_url: string;
  uploaded_by: string;
}

interface PhotoItemProps {
  photo: Photo;
  user: User;
  onDelete: () => void;
  onSelectPhoto: (photo: Photo) => void;
  accessToken: string | null;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, user, onDelete }) => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function deletePhoto(e: React.MouseEvent) {
    e.stopPropagation();

    if (!user) {
      alert(t("cannot-delete-photo"));
      return;
    }

    const { error: dbError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", photo.id);

    if (dbError) {
      console.error("Error deleteing from DB:", dbError);
      return;
    }

    try {
      const storageUrl = supabase.storage.from("gallery").getPublicUrl("")
        .data.publicUrl;
      const filePath = photo.image_url
        .replace(storageUrl, "")
        .replace(/^\/+/, "");

      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([filePath]);

      if (storageError) {
        console.error("Storage error:", storageError);
      } else {
        console.log("Successfully deleted:", filePath);
      }
    } catch (error) {
      console.error("Error in file dir:", error);
    }

    onDelete();
  }

  const canDelete =
    user?.app_metadata?.role === "super-admin" ||
    photo.uploaded_by === user?.id;

  return (
    <>
      <div
        className="relative rounded overflow-hidden bg-white shadow cursor-pointer hover:opacity-90 transition"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={photo.image_url}
          alt="{t('photo-alt')}"
          className="w-full h-40 object-cover"
        />
        {canDelete && (
          <button
            onClick={deletePhoto}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded"
          >
            {t("delete")}
          </button>
        )}
      </div>

      {isModalOpen && (
        <Modal
          imageUrl={photo.image_url}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default PhotoItem;
