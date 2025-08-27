"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import img from "@/assets/gallery-section.png";
const GalleryHeroSection = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-16 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 2xl:px-32 
    flex flex-col lg:flex-row items-center lg:justify-between 
    min-h-screen lg:gap-20 xl:gap-24"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full max-w-[500px] xl:max-w-[600px] flex items-center justify-center z-0"
      >
        <img className="rounded-lg" src={img}></img>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.3, duration: 1 }}
        className="relative bg-transparent w-full max-w-[500px] xl:max-w-[600px] text-center lg:text-left z-10 p-4"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-800"
        >
          {t("gallery")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base xl:text-lg"
        >
          {t("gallery-description")}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          href="/gallery"
          className="mt-6 inline-block px-6 py-3 bg-green-bg hover:bg-green-700 text-white font-bold rounded-lg mx-auto lg:mx-0 lg:mr-auto"
        >
          {t("watch")}
        </motion.a>
      </motion.div>
    </section>
  );
};

export default GalleryHeroSection;
