"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  {
    label: "Eesti",
    value: "et",
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 480"
        className="w-5 h-5"
      >
        <g fillRule="evenodd" strokeWidth="1pt">
          <path fill="#0072ce" d="M0 0h640v160H0z" />
          <path fill="#000" d="M0 160h640v160H0z" />
          <path fill="#fff" d="M0 320h640v160H0z" />
        </g>
      </svg>
    ),
  },
  {
    label: "English",
    value: "en",
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 480"
        className="w-5 h-5"
      >
        <path fill="#012169" d="M0 0h640v480H0z" />
        <path stroke="#fff" strokeWidth="60" d="M0 0l640 480m0-480L0 480" />
        <path stroke="#c8102e" strokeWidth="40" d="M0 0l640 480m0-480L0 480" />
        <path fill="#fff" d="M267 0v480h106V0H267zM0 186v108h640V186H0z" />
        <path fill="#c8102e" d="M293 0v480h54V0h-54zM0 212v54h640v-54H0z" />
      </svg>
    ),
  },
  {
    label: "Русский",
    value: "ru",
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 480"
        className="w-5 h-5"
      >
        <g fillRule="evenodd" strokeWidth="1pt">
          <path fill="#fff" d="M0 0h640v480H0z" />
          <path fill="#0039a6" d="M0 160h640v320H0z" />
          <path fill="#d52b1e" d="M0 320h640v160H0z" />
        </g>
      </svg>
    ),
  },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClickOutside]);

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    setSelectedLanguage(value);
    localStorage.setItem("i18nextLng", value);
    setOpen(false);
  };

  const currentLang = languages.find((lang) => lang.value === selectedLanguage);

  return (
    <div className="relative inline-block bg-green-600 text-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-3 py-1 border rounded w-16 bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="font-medium">{currentLang?.value.toUpperCase()}</span>
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="absolute left-0 mt-1 w-32 bg-green-600 border border-gray-300 rounded shadow-lg z-10"
          role="menu"
        >
          {languages.map((language) => (
            <div
              key={language.value}
              onClick={() => changeLanguage(language.value)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-green-700 cursor-pointer"
              role="menuitem"
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
