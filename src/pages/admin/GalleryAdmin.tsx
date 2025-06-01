"use client";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import UploadForm from "@/components/gallery/UploadForm";
import PhotoGrid from "@/components/gallery/PhotoGrid";
import { useTranslation } from "react-i18next";

interface Photo {
  id: string;
  image_url: string;
  uploaded_by: string;
  created_at?: string;
}

const fetchGallery = async () => {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Ошибка загрузки галереи");
  return data;
};

const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: photos,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGallery,
    staleTime: 5 * 60 * 1000,
  });

  const handleNewPhoto = (newPhoto: Photo) => {
    queryClient.setQueryData(["gallery"], (oldPhotos: Photo[] | undefined) => {
      return oldPhotos ? [newPhoto, ...oldPhotos] : [newPhoto];
    });
  };

  return (
    <div className="min-h-screen py-10 px-5 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4"> {t("gallery")}</h1>

      {user && <UploadForm onUpload={handleNewPhoto} />}

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <PhotoGrid
          photos={photos || []}
          user={user}
          onDelete={() =>
            queryClient.invalidateQueries({ queryKey: ["gallery"] })
          }
          onSelectPhoto={() => {}}
          accessToken={accessToken}
        />
      )}
    </div>
  );
};

export default Gallery;
