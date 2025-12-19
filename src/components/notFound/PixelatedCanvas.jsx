"use client";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import heroImage from "../../assets/images/hero.png";
import { useEffect, useState } from "react";

export function PixelatedCanvasDemo() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      
      if (screenWidth >= 1280) {
        setDimensions({ width: 700, height: 500 });
      } else if (screenWidth >= 1024) {
        setDimensions({ width: 600, height: 400 });
      } else {
        setDimensions({ width: 800, height: 600 });
      }
    };
    
    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <PixelatedCanvas
        src={heroImage}
        width={dimensions.width}
        height={dimensions.height}
        cellSize={4}
        dotScale={0.9}
        shape="square"
        backgroundColor="#000000"
        dropoutStrength={0.1}
        interactive={true}
        distortionStrength={0.1}
        distortionRadius={200}
        distortionMode="swirl"
        followSpeed={0.9}
        jitterStrength={5}
        jitterSpeed={3}
        sampleAverage
        responsive
        fadeOnLeave={true}
        fadeSpeed={0.1}
        className="rounded-xl shadow-lg"
      />
    </div>
  );
}