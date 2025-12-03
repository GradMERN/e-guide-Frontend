"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

interface ImageObject {
  src: string;
  alt?: string;
}

interface ImagesSliderProps {
  images: string[] | ImageObject[];
  children?: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  interval?: number; 
}

export const ImagesSlider: React.FC<ImagesSliderProps> = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<ImageObject[]>(() =>
    images.slice(0, 1).map(item => typeof item === "string" ? { src: item } : item)
  );

  useEffect(() => {
    const promises = images.slice(1).map((item) => {
      const src = typeof item === "string" ? item : item.src;
      return new Promise<ImageObject>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () =>
          resolve(typeof item === "string" ? { src } : item);
        img.onerror = reject;
      });
    });

    Promise.all(promises)
      .then((imgs) => setLoadedImages(prev => [...prev, ...imgs]))
      .catch((err) => console.error("Failed to load images", err));
  }, [images]);


  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % loadedImages.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + loadedImages.length) % loadedImages.length);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
    };
    window.addEventListener("keydown", handleKey);

    let autoplayInterval: number;
    if (autoplay) {
      autoplayInterval = setInterval(handleNext, interval);
    }

    return () => {
      window.removeEventListener("keydown", handleKey);
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
  }, [autoplay, interval, loadedImages.length]);

  if (!loadedImages.length) return null;

  return (
    <div className={cn("relative w-full h-screen overflow-hidden perspective-[1000px]", className)}>
      {overlay && (
        <div className={cn("absolute inset-0 z-40 pointer-events-none bg-black/76",overlayClassName)}/>
      )}

      {children && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
          {children}
        </div>
      )}

      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={loadedImages[currentIndex].src}
          alt={loadedImages[currentIndex].alt || ""}
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </div>
  );
};
