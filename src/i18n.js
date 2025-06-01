// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/i18n/en.json";
import ru from "@/i18n/ru.json";
import et from "@/i18n/et.json";

const defaultLang = localStorage.getItem("i18nextLng") || "et";

i18n.use(initReactI18next).init({
  lng: defaultLang,
  fallbackLng: "et",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    et: { translation: et },
  },
});

export default i18n;
