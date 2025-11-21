"use client";

import { DirectionAwareHover } from "../ui/direction-aware-hover";
import photo30 from "../../assets/images/photo-30.webp";

export function DirectionAwareHoverImage({ className }) {
  const imageUrl = photo30;

  return (
    <div className={`h-40rem relative flex items-center justify-center ${className}`}>
      <DirectionAwareHover imageUrl={imageUrl}>
        <div className="absolute bottom-6 left-6 text-white">
          <p className="font-bold text-xl">Aswan</p>
        </div>
      </DirectionAwareHover>
    </div>
  );
}
