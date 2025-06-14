"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import img1 from "@/assets/pedicur-1.jpg";
import img2 from "@/assets/pedicur-2.jpeg";
import img3 from "@/assets/pedicur-3.jpeg";

const AboutSection = () => {
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
        <motion.img
          src={img1}
          alt="Main"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full h-auto rounded-xl shadow-lg"
        />

        <motion.img
          src={img2}
          alt="Top Right"
          initial={{ opacity: 0, x: 50, y: -50 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
          className="hidden md:block absolute top-[-20px] right-[-15px] md:right-[-10%] 
                     md:top-[-15%] w-[140px] md:w-[180px] lg:w-[200px] xl:w-[220px] 2xl:w-[240px] 
                     rounded-xl shadow-md"
        />

        <motion.img
          src={img3}
          alt="Bottom Left"
          initial={{ opacity: 0, x: -50, y: 50 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 1 }}
          className="hidden md:block absolute bottom-[-15%] left-[-5%] md:left-[-10%] 
                     w-[160px] md:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px] 
                     rounded-xl shadow-md"
        />
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
          {t("about-title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base xl:text-lg"
        >
          {t("about-description")}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 px-5 py-2.5 sm:px-6 sm:py-3 xl:px-8 xl:py-4 bg-green-bg hover:bg-green-700 text-white font-bold rounded-lg"
        >
          {t("learn-more")}
        </motion.button>
      </motion.div>
    </section>
  );
};

export default AboutSection;
