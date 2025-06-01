"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabaseClient";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const fetchGallery = async () => {
  const { data, error } = await supabase
    .from("gallery")
    .select("image_url")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Ошибка загрузки галереи:", error);
    return [];
  }

  return data;
};

const ServicesSection = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const { data: photos, isLoading } = useQuery({
    queryKey: ["gallery", 20],
    queryFn: fetchGallery,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section
      ref={ref}
      id="services"
      className="relative py-16 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 2xl:px-32 
      flex flex-col lg:flex-row items-center lg:justify-between 
      min-h-screen lg:gap-20 xl:gap-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full lg:w-1/2 max-w-2xl lg:order-2 mb-10 lg:mb-0 relative"
      >
        <Carousel className="relative overflow-hidden w-full">
          <CarouselPrevious className="absolute left-2 sm:left-4 z-10 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
          >
            <CarouselContent className="flex">
              {isLoading ? (
                <p className="text-gray-500 text-center py-10">
                  {t("loading-images")}
                </p>
              ) : (
                photos?.map((photo, index) => (
                  <CarouselItem key={index} className="relative w-full">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.8 + index * 0.1 }}
                      className="w-full h-[340px] sm:h-[350px] md:h-[400px] lg:h-[400px] xl:h-[450px] overflow-hidden rounded-xl shadow-lg"
                    >
                      <img
                        src={photo.image_url}
                        alt={t("photo-alt")}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
          </motion.div>
          <CarouselNext className="absolute right-2 sm:right-4 z-10 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition" />
        </Carousel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="flex flex-col w-full lg:w-1/2 max-w-lg text-center lg:text-left"
      >
        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-800">
          {t("services-title")}
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base xl:text-lg">
          {t("services-description")}
        </p>
        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          href="/booking"
          role="button"
          className="mt-6 inline-block px-6 py-3 bg-green-bg hover:bg-green-700 text-white font-bold rounded-lg mx-auto lg:mx-0 lg:mr-auto"
        >
          {t("book-now")}
        </motion.a>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
