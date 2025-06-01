"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PriceCard from "@/components/PriceCard";

const PriceListSection = () => {
  const { t } = useTranslation();

  const categories = [
    {
      title: t("price-medical-care"),
      items: [
        { name: t("price-basic-medical-pedicure"), price: "€40" },
        { name: t("price-diabetic-foot-care"), price: "€50" },
        { name: t("price-ingrown-nail-treatment"), price: "€45" },
        { name: t("price-fungal-nail-treatment"), price: "€40" },
      ],
    },
    {
      title: t("price-aesthetic-addons"),
      items: [
        { name: t("price-gel-polish"), price: "€25" },
        { name: t("price-nail-trimming-and-shaping"), price: "€20" },
        { name: t("price-polish-removal"), price: "€10" },
        { name: t("price-french-finish"), price: "€10" },
      ],
    },
    {
      title: t("price-additional-therapies"),
      items: [
        { name: t("price-foot-massage"), price: "€20" },
        { name: t("price-paraffin-wrap"), price: "€30" },
        { name: t("price-callus-removal"), price: "€20" },
        { name: t("price-hydration-mask"), price: "€35" },
      ],
    },
  ];

  return (
    <section
      id="pricelist"
      className="relative py-16 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 2xl:px-32 
      flex flex-col items-center min-h-screen gap-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="container mx-auto px-6 py-6 rounded-md bg-green-bg/80"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-bold text-white mb-8 text-center"
        >
          {t("price-list-title")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <PriceCard
              key={index}
              title={category.title}
              items={category.items}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PriceListSection;
