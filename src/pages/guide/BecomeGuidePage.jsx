import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { guideApplicationService } from "../../apis/guideApplicationService";

import BecomeGuideForm from "../../components/guide/BecomeGuide/GuideForm/BecomeGuideForm";
import LoadingScreen from "../../components/common/LoadingScreen";
import PageHeader from "../../components/guide/BecomeGuide/PageHeader";
import ProgressTracker from "../../components/guide/BecomeGuide/ProgressTracker";
import StatusCard from "../../components/guide/BecomeGuide/StatusCard";
import RejectionNotice from "../../components/guide/BecomeGuide/RejectionNotice";

const BecomeGuidePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "guide" && window.location.pathname !== "/guide/dashboard") {
      navigate("/guide/dashboard");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    const checkApplication = async () => {
      try {
        setLoading(true);
        const response = await guideApplicationService.getMyApplication();
        if (response.data?.application) {
          setApplication(response.data.application);
        } else if (response.data?.data) {
          setApplication(response.data.data);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Error checking application:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    checkApplication();
  }, [user, navigate, authLoading]);

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.role === "guide") {
    navigate("/guide/dashboard");
    return null;
  }

  if (user.role === "admin") {
    navigate("/admin/dashboard");
    return null;
  }

  if (application && application.status === "rejected") {
    return (
      <div className="min-h-screen relative overflow-hidden transition-colors duration-500 pt-16 sm:pt-20 px-3 sm:px-4 md:px-6 bg-background text-text w-full max-w-[100vw]">
        
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] sm:w-[50vw] h-[60vw] sm:h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] pointer-events-none opacity-20 bg-primary" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] sm:w-[50vw] h-[60vw] sm:h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] pointer-events-none opacity-20 bg-secondary" />

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30h10v10H30zM10 10h10v10H10z' fill='%23b06419' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,}}/>

        <div className="max-w-4xl mx-auto relative z-10 pb-12 sm:pb-16 md:pb-20">
          <RejectionNotice application={application} t={t} />
          <PageHeader title={t("guide.reapply", "Reapply as a Tour Guide")} description={t("guide.reapplyDescription", "Update your information and submit a new application.")}/>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-(--surface) rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border border-(--border)">
            <BecomeGuideForm isReapply={true} previousApplication={application} />
          </motion.div>
        </div>
      </div>
    );
  }

  if (application) {
    return (
      <div className="min-h-screen relative overflow-hidden transition-colors duration-500 pt-16 sm:pt-20 px-3 sm:px-4 md:px-6 bg-background text-text w-full max-w-[100vw]">
        
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] sm:w-[50vw] h-[60vw] sm:h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] pointer-events-none opacity-20 bg-primary" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] sm:w-[50vw] h-[60vw] sm:h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] pointer-events-none opacity-20 bg-secondary" />

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30h10v10H30zM10 10h10v10H10z' fill='%23b06419' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,}}/>

        <div className="max-w-4xl mx-auto relative z-10 pb-12 sm:pb-16 md:pb-20">
          <ProgressTracker application={application} t={t} />
          <StatusCard application={application} t={t} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500 pt-16 sm:pt-20 px-3 sm:px-4 md:px-6 bg-background text-text w-full max-w-[100vw]">
      
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] sm:w-[50vw] h-[60vw] sm:h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] pointer-events-none opacity-20 bg-primary" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] sm:w-[50vw] h-[60vw] sm:h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] pointer-events-none opacity-20 bg-secondary" />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30h10v10H30zM10 10h10v10H10z' fill='%23b06419' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,}}/>

      <div className="max-w-4xl mx-auto relative z-10 pb-12 sm:pb-16 md:pb-20">
        <PageHeader title={t("guide.becomeGuide", "Become a Tour Guide")} description={t( "guide.becomeGuideDescription", "Share your expertise and passion for Egypt with travelers from around the world. Join our community of professional tour guides.")}/>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-(--surface) rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border border-(--border)">
          <BecomeGuideForm />
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeGuidePage;