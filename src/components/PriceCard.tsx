"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface PriceItem {
  name: string;
  price: string;
}

interface PriceCardProps {
  title: string;
  items: PriceItem[];
  index: number;
}

const PriceCard: React.FC<PriceCardProps> = ({ title, items, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 * index, duration: 0.8 }}
      className="bg-white shadow-lg rounded-lg p-6"
    >
      <h3 className="text-2xl font-semibold text-green-600 mb-4">{title}</h3>
      <ul className="space-y-3 text-lg">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between border-b pb-2">
            <span>{item.name}</span>
            <span className="font-bold">{item.price}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PriceCard;
