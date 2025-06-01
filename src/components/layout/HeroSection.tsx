"use client";

import { motion } from "framer-motion";
import bgImage from "@/assets/hero-bg.jpg";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section
      className="h-screen flex flex-col items-center justify-center text-white bg-cover bg-center bg-no-repeat"
      id="hero"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex align-center justify-center flex-col bg-green-bg/80 p-5 rounded shadow-lg
             max-w-xs mx-10 sm:max-w-none sm:mx-0"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-bold"
        >
          {t("welcome-to")} ProPedicure
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-2 text-lg"
        >
          {t("book-your-appointemnts-with-us-today")}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: "easeInOut" }}
          className="mt-4 px-6 py-3 bg-green-900 hover:bg-green-500 text-white text-center font-bold rounded"
          href="./booking"
        >
          {t("book")}
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
