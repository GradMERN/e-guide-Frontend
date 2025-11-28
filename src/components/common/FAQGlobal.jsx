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
      <div className="max-w-4xl lg:max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {categories.map((category, catIndex) => {
          const Icon = category.icon;
          const isOpenCategory = openCategory === catIndex;

          return (
            <motion.div key={catIndex} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, delay: catIndex * 0.2 }} className="rounded-2xl shadow-2xl">
              <div className="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-linear-to-r from-[#B9934C] via-[#e8bd72] to-[#b58a3f] cursor-pointer transition-colors duration-300 hover:bg-linear-to-r hover:from-[#d1a85b] hover:via-[#e0c083] hover:to-[#c4984f]" onClick={() => toggleCategory(catIndex)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="text-amber-950 w-6 h-6" />
                    <div>
                      <h3 className="text-lg font-bold text-amber-950">{category.title}</h3>
                      <span className="text-xs text-white/90">{isOpenCategory? "Click to collapse" : "Click to expand"}</span>
                    </div>
                  </div>
                  <IoChevronDown className={`transition-transform duration-400 ${ isOpenCategory ? "rotate-180" : ""} text-amber-950`} size={24}/>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpenCategory && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="overflow-hidden">
                    {category.questions.map((question, qIndex) => {
                      const key = `${catIndex}-${qIndex}`;
                      const isOpen = openItems[key];

                      return (
                        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className="overflow-hidden border-b last:border-b-0">
                          <button onClick={() => toggleItem(catIndex, qIndex)} className="w-full text-left px-4 py-4 sm:px-6 sm:py-5 flex justify-between items-center text-white hover:bg-amber-900/30 transition-colors">
                            <span className="text-lg font-medium pr-4"> {question.question} </span>
                            <IoChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`}size={22}/>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
                                <div className="px-4 pb-4 sm:px-6 sm:pb-6 mt-2">
                                  <p className="text-white/90 text-base border-l-4 border-amber-950 pl-4">{question.answer}</p>
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