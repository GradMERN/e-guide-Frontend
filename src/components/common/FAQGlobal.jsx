import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoChevronDown } from "react-icons/io5";

export default function FAQGlobal({ categories }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [openItems, setOpenItems] = useState({});

  const toggleCategory = (catIndex) => {
    setOpenCategory((prev) => (prev === catIndex ? null : catIndex));
    setOpenItems({});
  };

  const toggleItem = (catIndex, qIndex) => {
    const key = `${catIndex}-${qIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
      <div className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {categories.map((category, catIndex) => {
          const Icon = category.icon;
          const isOpenCategory = openCategory === catIndex;

          return (
            <motion.div key={catIndex} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: catIndex * 0.2 }} className="rounded-2xl shadow-2xl">
              
              <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 rounded-2xl bg-linear-to-r from-[#B9934C] via-[#e8bd72] to-[#b58a3f] cursor-pointer transition-colors duration-300 hover:from-[#d1a85b] hover:via-[#e0c083] hover:to-[#c4984f]"
                onClick={() => toggleCategory(catIndex)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <Icon className="text-amber-950 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-amber-950">{category.title}</span>
                      <span className="text-[10px] sm:text-xs md:text-sm text-white">{isOpenCategory ? "Click to collapse" : "Click to expand"}</span>
                    </div>
                  </div>
                  <IoChevronDown className={`transition-transform duration-400 ${isOpenCategory ? "rotate-180" : ""} text-amber-950`} size={24}/>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpenCategory && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    {category.questions.map((question, qIndex) => {
                      const key = `${catIndex}-${qIndex}`;
                      const isOpen = openItems[key];

                      return (
                        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className="overflow-hidden border-b last:border-b-0">
                          <button onClick={() => toggleItem(catIndex, qIndex)} className="w-full text-left px-4 py-4 sm:px-6 sm:py-5 flex justify-between items-center text-white hover:bg-amber-900/30 transition-colors">
                            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium pr-2 sm:pr-4"> {question.question} </span>
                            <IoChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`}size={22}/>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
                                <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-5 mt-2">
                                  <p className="text-white/90 text-sm sm:text-base md:text-lg border-l-4 border-amber-950 pl-3 sm:pl-4 md:pl-5">{question.answer}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
  );
};