"use client";

import React from "react";

interface ModalProps {
  imageUrl: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
      onClick={onClose}
    >
      <div className="relative p-4 bg-white rounded-lg shadow-lg">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          ✖
        </button>
        <img
          src={imageUrl}
          alt="Full Size"
          className="max-w-full max-h-screen rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Modal;
