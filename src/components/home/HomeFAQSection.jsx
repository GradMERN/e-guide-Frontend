import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BsQuestionSquare } from "react-icons/bs";
import {FaInfoCircle,FaLandmark,FaMobileAlt,FaUser,FaMapMarkerAlt,FaGlobe,} from "react-icons/fa";
import FAQGlobal from "../common/FAQGlobal";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";


const FAQSection = () => {
  const { t } = useTranslation();
  const icons = [ FaInfoCircle, FaLandmark, FaMobileAlt, FaUser, FaMapMarkerAlt, FaGlobe];

  const faqCategories = t("faq.categories", { returnObjects: true });
  const parsedCategories = Object.keys(faqCategories).map((key, index) => {
    const category = faqCategories[key];
    const IconComponent = icons[index] || BsQuestionSquare;
    return {
      id: key,
      title: category.title,
      icon: IconComponent,
      questions: Object.values(category.questions),
    };
  });

  return (
    <SectionWrapperFull>
      <TitlesHome icon={BsQuestionSquare} title={t('faq.title')} paragraph={t('faq.subtitle')}
      />
      <FAQGlobal categories={parsedCategories} />
    </SectionWrapperFull>
  );
};

export default FAQSection;