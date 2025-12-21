import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import SlideOne from '../../components/overview/slide1';
import SlideTwo from '../../components/overview/slide2';
import SlideThree from '../../components/overview/slide3';
import SlideFour from '../../components/overview/slide4';
import SlideFive from '../../components/overview/slide5';
import SlideSix from '../../components/overview/slide6';
import SlideSeven from '../../components/overview/slide7';
import SlideEight from '../../components/overview/slide8';
import SlideNine from '../../components/overview/slide9';

const slides = [SlideOne, SlideTwo, SlideThree, SlideFour, SlideFive, SlideSix, SlideSeven, SlideEight, SlideNine];

const OverviewPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isScrolling = useRef(false);
  const touchStart = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      if (isScrolling.current) return;
      if (e.deltaY > 0 && currentSlide < slides.length - 1) {
        changeSlide(currentSlide + 1);
      } else if (e.deltaY < 0 && currentSlide > 0) {
        changeSlide(currentSlide - 1);
      }
    };

    const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
    const handleTouchMove = (e) => {
      if (isScrolling.current || !touchStart.current) return;
      const touchEnd = e.touches[0].clientY;
      const diff = touchStart.current - touchEnd;

      if (Math.abs(diff) > 50) { // Swipe threshold
        if (diff > 0 && currentSlide < slides.length - 1) changeSlide(currentSlide + 1);
        else if (diff < 0 && currentSlide > 0) changeSlide(currentSlide - 1);
        touchStart.current = null;
      }
    };

    const changeSlide = (index) => {
      isScrolling.current = true;
      setCurrentSlide(index);
      setTimeout(() => { isScrolling.current = false; }, 800);
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentSlide]);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div dir='ltr' className="relative h-screen w-full bg-black overflow-hidden font-serif">
      <AnimatePresence mode="wait">
        <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="h-full w-full overflow-y-auto pb-22 md:pb-0">
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      <div className="fixed top-4 left-4 md:top-8 md:left-6 z-50">
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 hover:border-primary transition-all text-white group shadow-2xl">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-primary md:w-[18px]" />
          <span className="group-hover:text-primary transition-colors font-medium text-[10px] md:text-xs tracking-widest md:tracking-[0.2em] uppercase">
            Back to Home
          </span>
        </button>
      </div>

      <div className="hidden sm:flex fixed left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-50 flex-col items-center gap-4 md:gap-8">
        <div className="h-10 md:h-16 w-px bg-linear-to-b from-transparent to-primary/40" />
        <div className="flex flex-col gap-4 md:gap-5">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className="relative flex items-center justify-center group">
              {currentSlide === idx && ( <motion.div layoutId="activeDot" className="absolute w-5 h-5 md:w-6 md:h-6 border border-primary/60 rounded-full"/>)}
              <div className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-primary scale-125' : 'bg-white/20'}`} />
            </button>
          ))}
        </div>
        <div className="h-10 md:h-16 w-px bg-linear-to-t from-transparent to-primary/40" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:bottom-10 md:right-8 md:left-auto z-50 pointer-events-auto">
        <div className="flex items-center justify-center md:justify-end gap-4 md:gap-8 px-4 py-4 md:p-0 bg-black/60 backdrop-blur-md md:bg-transparent md:backdrop-blur-none border-t border-white/10 md:border-t-0">
          
          <div className="flex flex-row md:flex-col gap-0 border border-white/10 rounded-sm overflow-hidden bg-black/40 backdrop-blur-sm">
            <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} disabled={currentSlide === 0} className={`p-3 md:p-5 transition-all active:bg-primary/20 md:hover:bg-primary md:hover:text-black border-r md:border-r-0 md:border-b border-white/10 ${currentSlide === 0 ? 'opacity-10 cursor-not-allowed text-gray-500' : 'text-primary'}`}>
              <ChevronUp size={20} className="md:w-6" strokeWidth={2.5} />
            </button>
            <button onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))} disabled={currentSlide === slides.length - 1} className={`p-3 md:p-5 transition-all active:bg-primary/20 md:hover:bg-primary md:hover:text-black ${currentSlide === slides.length - 1 ? 'opacity-10 cursor-not-allowed text-gray-500' : 'text-primary'}`}>
              <ChevronDown size={20} className="md:w-6" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-primary font-bold text-2xl md:text-3xl tracking-tighter">
              {String(currentSlide + 1).padStart(2, '0')}
            </span>
            <div className="w-8 md:w-10 h-px bg-primary/30 my-1" />
            <span className="text-white/30 font-medium text-xs md:text-sm">
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;