import { useTranslation } from "react-i18next";
import { MdOutlineTour } from "react-icons/md";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";

export default function TourPackagesSection() {
  const { t } = useTranslation();
  return (
    <SectionWrapperFull>
      <TitlesHome icon={MdOutlineTour} title={t("tourPackages.title")} paragraph={t("tourPackages.description")}/>
    </SectionWrapperFull>
  );
}
