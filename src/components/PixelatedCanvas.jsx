"use client";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import heroImage from "../assets/images/hero.png"; 

export function PixelatedCanvasDemo() {
  return (
    <div className="mx-auto mt-8 flex w-full items-center justify-center">
      <div>
        <PixelatedCanvas
          src={heroImage}
          width={800}
          height={600}
          cellSize={4}
          dotScale={0.9}
          shape="square"
          backgroundColor="#000002"
          dropoutStrength={0.1}
          interactive
          distortionStrength={0.1}
          distortionRadius={200}
          distortionMode="swirl"
          followSpeed={0.9}
          jitterStrength={5}
          jitterSpeed={3}
          sampleAverage
          responsive
          fadeOnLeave
          fadeSpeed={0.1}
          className="rounded-xl shadow-lg max-w-full h-auto"
        />
      </div>
    </div>
  );
}