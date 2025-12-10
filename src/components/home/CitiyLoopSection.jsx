import { useRef, useEffect, useState } from "react";

const cities = ["Cairo","Alexandria","Giza","Luxor","Aswan", "Hurghada","Sharm El-Sheikh","Mansoura","Dahab","Fayoum"];

export default function CityLoop() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const firstCopyRef = useRef(null);
  const secondCopyRef = useRef(null);
  const rafRef = useRef(null);
  const offsetRef = useRef(0);
  
  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(3);

  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;

      if (firstCopyRef.current && secondCopyRef.current) {
        const firstRect = firstCopyRef.current.getBoundingClientRect();
        const secondRect = secondCopyRef.current.getBoundingClientRect();
        const actualWidth = secondRect.left - firstRect.left;

        if (actualWidth > 0) {
          setSeqWidth(actualWidth);
          const copiesNeeded = Math.ceil(containerWidth / actualWidth) + 2;
          setCopyCount(Math.max(3, copiesNeeded));
        }
      }
    };

    const timer = setTimeout(updateDimensions, 100);

    window.addEventListener("resize", updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth === 0) return;

    let lastTimestamp = null;

    const animate = (timestamp) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;

      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const velocity = 50; // pixels per second
      offsetRef.current += velocity * deltaTime;

      // wrap around to create seamless loop
      offsetRef.current = offsetRef.current % seqWidth;

      // Force left-to-right scroll
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [seqWidth]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden py-3 bg-tertiary" style={{ direction: "ltr" }}>
      <div ref={trackRef} className="flex gap-16 will-change-transform" style={{ direction: "ltr" }}>
        {Array.from({ length: copyCount }, (_, copyIndex) => (
          <div key={copyIndex} ref={copyIndex === 0 ? firstCopyRef : copyIndex === 1 ? secondCopyRef : null} className="flex gap-16 shrink-0">
            {cities.map((city, i) => (
              <span key={`${copyIndex}-${i}`} className="text-loop font-bold text-lg whitespace-nowrap">
                {city}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};