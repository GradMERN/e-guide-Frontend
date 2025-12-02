import { cn } from "../utils/cn";
import React, { useEffect, useState } from "react";
import "../../styles/InfiniteMovingCards.css";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);

    scrollerContent.forEach((item) => {
      const clone = item.cloneNode(true);
      scrollerRef.current?.appendChild(clone);
    });

    const dir = direction === "left" ? "normal" : "reverse";
    containerRef.current.style.setProperty("--animation-direction", dir);

    const totalWidth = scrollerRef.current.scrollWidth / 2; 

    let speedMultiplier = speed === "fast" ? 0.6 : speed === "normal" ? 1 : 1.5;

    const duration = totalWidth * 0.03 * speedMultiplier + "s";
    containerRef.current.style.setProperty("--animation-duration", duration);

    setStart(true);
  }, [direction, speed]);

  return (
    <div ref={containerRef}
      className={cn("scroller relative w-full overflow-hidden", pauseOnHover && "pause-on-hover")}>
      <ul ref={scrollerRef}className={cn("flex w-max gap-4",start && "animate-scroll",className)}>
        {items.map((item, idx) => (
          <li key={item.name + idx}className="shrink-0 w-[350px] md:w-[450px] rounded-2xl border bg-white/5 backdrop-blur-md border-white/10 p-8">
            <blockquote className="flex flex-col h-full">
              <p className="text-gray-300 text-sm leading-relaxed flex-1">{item.quote}</p>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-white font-semibold">{item.name}</p>
                <p className="text-secondary text-sm">{item.title}</p>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
