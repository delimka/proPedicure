"use client";

import { useEffect, useState } from "react";

interface SuccessMessageProps {
  message: string;
  type?: "inline" | "toast"; 
  duration?: number; 
}

export default function SuccessMessage({
  message,
  type = "inline",
  duration = 3000,
}: SuccessMessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const baseClasses =
    "p-4 bg-green-100 border border-green-300 text-green-700 rounded transition-opacity duration-500";
  const variantClasses = type === "toast" ? "fixed top-4 right-4 z-50" : "mt-4";

  return (
    <div className={`${baseClasses} ${variantClasses} ${visible ? "opacity-100" : "opacity-0"}`}>
      {message}
    </div>
  );
}
