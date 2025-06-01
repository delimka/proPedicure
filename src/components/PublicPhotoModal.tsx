"use client";

import React from "react";

interface PhotoModalProps {
  imageUrl: string;
  onClose: () => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  imageUrl,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] max-w-[800px] h-[70vh] max-h-[600px] bg-white rounded-lg shadow-lg flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Просмотр фото"
          className="w-full h-full rounded-lg 
                     object-cover md:object-cover sm:object-contain"
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-900 text-white p-3 text-lg rounded-full hover:bg-gray-700 transition"
        >
          ✖
        </button>

        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute top-1/2 left-4 bg-gray-900 text-white p-4 text-lg rounded-full hover:bg-gray-700 transition"
          >
            ←
          </button>
        )}

        {hasNext && (
          <button
            onClick={onNext}
            className="absolute top-1/2 right-4 bg-gray-900 text-white p-4 text-lg rounded-full hover:bg-gray-700 transition"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
};

export default PhotoModal;
