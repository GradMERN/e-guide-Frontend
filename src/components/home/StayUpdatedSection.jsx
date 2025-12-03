import { useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { FaEnvelope, FaCheck, FaPlaneDeparture, FaMoneyBillWave, FaLock, FaEnvelopeOpenText   } from "react-icons/fa";
import { GiWorld, GiAncientColumns } from "react-icons/gi";
import TitlesHome from "../common/TitlesHome";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "motion/react";
import SectionWrapperFull from "../common/SectionWrapper";


export default function StayUpdatedSection() {
  const [subscribed, setSubscribed] = useState(false);

  const topics = [
    { id: "tours", label: "New Tours", icon: <GiWorld size={30} /> },
    {id: "deals",label: "Special Deals",icon: <FaMoneyBillWave size={30} />,},
    {id: "tips",label: "Travel Tips",icon: <FaPlaneDeparture size={30} />,},
    {id: "culture",label: "Culture & History",icon: <GiAncientColumns size={30} />,},
  ];

  const initialValues = {email: "", selectedTopics: [],};

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    selectedTopics: Yup.array()
      .min(1, "Please select at least one topic")
      .required("Please select at least one topic"),
    });

    const handleSubmit = (values, { resetForm }) => {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false); 
        resetForm();
      }, 3000);
    };

  return (
    <SectionWrapperFull>
      <TitlesHome
        icon={GrUpdate}
        title="Stay Updated"
        paragraph="Subscribe to the latest news, travel insights, and special offers to make the most of your journey through Egypt."
      />

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border-4 border-amber-950 card-bg p-6 sm:p-8 md:p-12 shadow-2xl">
          <div className="relative z-10">
            {!subscribed ? (
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="mb-8">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-950 mb-4 text-center">What interests you?</h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                        {topics.map((topic) => (
                          <motion.button key={topic.id} type="button"
                            onClick={() => {
                              if (values.selectedTopics.includes(topic.id)) {
                                setFieldValue("selectedTopics",values.selectedTopics.filter((t) => t !== topic.id));
                              } else {
                                setFieldValue("selectedTopics", [...values.selectedTopics, topic.id,]);
                              }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                              values.selectedTopics.includes(topic.id) ? "bg-amber-950 border-amber-950 text-white scale-105" : "bg-white/20 border-white/40 text-amber-950 hover:bg-white/30"}`}>
                            <div className="mb-2 flex justify-center">{topic.icon}</div>
                            <div className="text-xs sm:text-sm font-semibold">{topic.label}</div>

                            {values.selectedTopics.includes(topic.id) && (
                              <FaCheck className="absolute top-2 right-2 text-[#FFD700]" size={16}/>
                            )}
                          </motion.button>
                        ))}
                      </div>

                      <ErrorMessage name="selectedTopics" component="div" className="text-red-600 text-sm mt-2 text-center"/>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-white/90 border-2 border-white/40 rounded-xl px-4 py-3 sm:py-4 focus-within:border-amber-950 transition-all duration-300">
                        <FaEnvelope className="text-amber-950/60 shrink-0" size={20} />
                        <Field type="email" name="email" placeholder="Enter your email address" className="flex-1 bg-transparent outline-none text-amber-950 placeholder-amber-950/50 text-base sm:text-lg" />
                      </div>
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-2" />


                      <button type="submit"
                        className={`w-full py-4 sm:py-5 rounded-xl font-bold text-lg transition-all duration-300 ${
                          values.selectedTopics.length > 0 && values.email ? "bg-amber-950 text-[#FFD700] hover:bg-black hover:scale-105 shadow-lg" : "bg-gray-400 text-gray-600 cursor-not-allowed" }`} disabled={!(values.email && values.selectedTopics.length > 0)}>
                        Subscribe Now
                      </button>
                    </div>

                    <p className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/80 mt-4">
                      <FaLock className="text-amber-950/80" size={14} />Your privacy matters. Unsubscribe anytime.</p>
                  </Form>
                )}
              </Formik>
            ) : (
              <AnimatePresence>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="text-center py-14 px-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheck size={40} className="text-white" />
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-950 mb-3">Successfully Subscribed!</h3>

                  <p className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg text-white">
                    <FaEnvelopeOpenText className="text-amber-950/90" size={22}/>
                    Check your inbox for a welcome email
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </SectionWrapperFull>
  );
};