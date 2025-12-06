import { cn } from "../utils/cn"; 
import React, { useEffect, useState } from "react"; 
import { FaStar } from "react-icons/fa";
import "../../styles/InfiniteMovingCards.css";
import { useTranslation } from "react-i18next";


export const InfiniteMovingCards = ({ 
  items, 
  direction = "left", 
  speed = "normal", 
  pauseOnHover = true, 
  className, 
}) => { 
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const containerRef = React.useRef(null); 
  const scrollerRef = React.useRef(null); 
  const [start, setStart] = useState(false); 

  useEffect(() => { 
    if (!containerRef.current || !scrollerRef.current) return; 

  const scrollerContent = Array.from(scrollerRef.current.children);
    const originalItemsCount = items.length;
    while (scrollerRef.current.children.length > originalItemsCount) {
      scrollerRef.current.removeChild(scrollerRef.current.lastChild);
    }

    const currentChildren = Array.from(scrollerRef.current.children);
    currentChildren.forEach((item) => { 
      const clone = item.cloneNode(true); 
      scrollerRef.current?.appendChild(clone); 
    }); 

    const finalDirection = isRTL ? (direction === "left" ? "right" : "left") : direction;
    const dir = finalDirection === "left" ? "normal" : "reverse";

    const totalWidth = scrollerRef.current.scrollWidth / 2; 
    const speedMultiplier = speed === "fast" ? 0.6 : speed === "normal" ? 1 : 1.5; 
    const duration = totalWidth * 0.03 * speedMultiplier + "s"; 
    containerRef.current.style.setProperty("--animation-duration", duration); 

    setStart(true); 
  }, [direction, speed]); 

  const getDisplayName = (fullName) => {
    if (!fullName) return "U";

    const nameParts = fullName.trim().split(/\s+/);
    const firstLetter = nameParts[0]?.charAt(0).toUpperCase() || "U";
    const secondLetter = nameParts[1]?.charAt(0).toUpperCase() || "";

    return firstLetter + secondLetter;
  };


  return (
    <div ref={containerRef}
      className={cn("scroller relative w-full overflow-hidden",pauseOnHover && "pause-on-hover")} dir={isRTL ? "rtl" : "ltr"}>
      <ul ref={scrollerRef} className={cn("flex w-max gap-6", start && "animate-scroll", className)}>
        {items.map((item, idx) => (
          <li key={item.name + idx} className="shrink-0 w-[250px] md:w-[300px] rounded-xl border border-border bg-surface backdrop-blur-md p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300" dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex items-center justify-end mb-3">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`w-3 h-3 ${ i < (item.rating || 5) ? "text-yellow-300" : "text-gray-300"}`}/>
              ))}
            </div>

            <p className="text-text text-xs md:text-sm leading-relaxed line-clamp-3 mb-4">{item.review} </p>

            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-base shrink-0">
                {getDisplayName(item.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-text font-bold text-sm truncate">{item.name}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ); 
};
