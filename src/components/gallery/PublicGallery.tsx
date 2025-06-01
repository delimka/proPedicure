"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabaseClient";
import PublicPhotoModal from "@/components/PublicPhotoModal";
import Skeleton from "@/components/Skeleton";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Photo {
  id: string;
  image_url: string;
  created_at?: string;
  uploaded_by?: string;
}

const PAGE_SIZE = 8;

async function fetchPhotos(pageParam = 0): Promise<Photo[]> {
  const start = pageParam * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  await new Promise((resolve) => setTimeout(resolve, 600));

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    throw new Error("Ошибка при загрузке фото: " + error.message);
  }
  return data || [];
}

const PublicGallery: React.FC = () => {
  const { t } = useTranslation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<Photo[], Error>({
      queryKey: ["gallery"],
      queryFn: async ({ pageParam = 0 }) => fetchPhotos(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < PAGE_SIZE) return undefined;
        return allPages.length;
      },
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [flatPhotos, setFlatPhotos] = useState<Photo[]>([]);
  const [loadedPhotos, setLoadedPhotos] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [firstBatchLoaded, setFirstBatchLoaded] = useState(false);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (data?.pages) {
      const all = data.pages.flat();
      setFlatPhotos(all);
      if (!firstBatchLoaded && all.length > 0) {
        setFirstBatchLoaded(true);
      }
    }
  }, [data, firstBatchLoaded]);

  const openModal = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeModal = () => {
    setSelectedPhotoIndex(null);
  };

  return (
    <div className="min-h-screen py-10 px-5 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{t("gallery")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {!firstBatchLoaded &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={`skeleton-first-${i}`} className="w-full h-40" />
          ))}

        {firstBatchLoaded &&
          flatPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div
                key={photo.id}
                className="relative rounded overflow-hidden bg-white shadow cursor-pointer hover:opacity-90 transition"
                onClick={() => openModal(index)}
              >
                {!loadedPhotos[photo.id] && (
                  <Skeleton className="absolute w-full h-40" />
                )}
                <img
                  src={photo.image_url}
                  alt={`Фото #${photo.id}`}
                  className={`w-full h-40 object-cover transition-opacity duration-500 ${
                    loadedPhotos[photo.id] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() =>
                    setLoadedPhotos((prev) => ({ ...prev, [photo.id]: true }))
                  }
                />
              </div>
            </motion.div>
          ))}

        {isFetchingNextPage &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="w-full h-40" />
          ))}
      </div>

      {hasNextPage && <div ref={loadMoreRef} className="h-2" />}

      {selectedPhotoIndex !== null && (
        <PublicPhotoModal
          imageUrl={flatPhotos[selectedPhotoIndex]?.image_url}
          onClose={closeModal}
          onNext={(e) => {
            e.stopPropagation();
            if (
              selectedPhotoIndex !== null &&
              selectedPhotoIndex < flatPhotos.length - 1
            ) {
              setSelectedPhotoIndex(selectedPhotoIndex + 1);
            } else if (hasNextPage) {
              fetchNextPage();
              setSelectedPhotoIndex(flatPhotos.length);
            }
          }}
          onPrev={(e) => {
            e.stopPropagation();
            if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
              setSelectedPhotoIndex(selectedPhotoIndex - 1);
            }
          }}
          hasNext={selectedPhotoIndex < flatPhotos.length - 1 || hasNextPage}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}
    </div>
  );
};

export default PublicGallery;
