"use client";

import React, { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface UploadFormProps {
  onUpload: (photo: Photo) => void;
}
interface Photo {
  id: string;
  image_url: string;
  uploaded_by: string;
  created_at?: string;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  async function uploadPhoto() {
    if (!file || !user) {
      alert(t("error-select-file-and-login"));
      return;
    }

    setLoading(true);
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert(t("upload-error"));
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      console.error("URL fetch error");
      alert(t("url-fetch-error"));
      setLoading(false);
      return;
    }

    const { data: insertedPhoto, error: insertError } = await supabase
      .from("gallery")
      .insert({ image_url: publicUrl, uploaded_by: user.id })
      .select("*")
      .single();

    if (insertedPhoto) {
      onUpload(insertedPhoto);
    }
    if (insertError) {
      console.error("Insert error:", insertError);
      alert(t("database-insert-error"));
      setLoading(false);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["gallery"] });
    setFile(null);
    setLoading(false);
  }

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-center gap-2">
      <div className="flex flex-col items-center gap-2">
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
          <Upload className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">
            {file ? file.name : t("select-file")}
          </span>
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        {file && (
          <p className="text-sm text-gray-500">
            {t("file-selected")}: {file.name}
          </p>
        )}
      </div>
      <button
        onClick={uploadPhoto}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? t("uploading") : t("upload")}
      </button>
    </div>
  );
};

export default UploadForm;
