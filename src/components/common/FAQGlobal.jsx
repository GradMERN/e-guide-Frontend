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
            <motion.div key={catIndex} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.3, delay: catIndex * 0.1 }} className="rounded-2xl">
              
              <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 rounded-2xl  bg-[linear-gradient(to_right,var(--gradient-from),var(--gradient-via),var(--gradient-to))] cursor-pointer duration-300"
                onClick={() => toggleCategory(catIndex)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <Icon className="faq-icon" />
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold faq-title">{category.title}</span>
                      <span className="text-[10px] sm:text-xs md:text-sm faq-title ">{isOpenCategory ? "Click to collapse" : "Click to expand"}</span>
                    </div>
                  </div>
                  <IoChevronDown className={`transition-transform duration-400 ${isOpenCategory ? "rotate-180" : ""} faq-title`} size={32}/>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpenCategory && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden">
                    {category.questions.map((question, qIndex) => {
                      const key = `${catIndex}-${qIndex}`;
                      const isOpen = openItems[key];

                      return (
                        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.5 }} className="overflow-hidden border-b last:border-b-0">
                          <button onClick={() => toggleItem(catIndex, qIndex)} className="w-full text-left px-4 py-4 sm:px-6 sm:py-5 flex justify-between items-center text-text ">
                            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium pr-2 sm:pr-4"> {question.question} </span>
                            <IoChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`}size={22}/>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5 }} className="overflow-hidden">
                                <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-5 mt-2">
                                  <p className="text-text text-sm sm:text-base md:text-lg border-l-4 faq-border pl-3 sm:pl-4 md:pl-5">{question.answer}</p>
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