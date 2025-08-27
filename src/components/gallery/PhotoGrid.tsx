"use client";
import React from "react";
import PhotoItem from "@/components/gallery/PhotoItem";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";

interface Photo {
  id: string;
  image_url: string;
  uploaded_by: string;
}

interface PhotoGridProps {
  photos: Photo[];
  user: User;
  onDelete: () => void;
  onSelectPhoto: (photo: Photo) => void;
  accessToken: string | null;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  user,
  onDelete,
  onSelectPhoto,
  accessToken,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <PhotoItem
            photo={photo}
            user={user}
            onDelete={onDelete}
            onSelectPhoto={onSelectPhoto}
            accessToken={accessToken}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PhotoGrid;
