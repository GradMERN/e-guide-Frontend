import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Scroll, Send } from 'lucide-react';
import { GiEgyptianProfile } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';


const CornerDecoration = ({ className }) => (
    <div className={`hidden sm:block w-8 h-8 sm:w-16 sm:h-16 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,20 Q0,0 20,0 L50,0 M0,20 L0,50"
                stroke="url(#themeGradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="20" cy="20" r="6" fill="url(#themeGradient)" />
            <defs>
                <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="50%" stopColor="var(--secondary)" />
                    <stop offset="100%" stopColor="var(--tertiary)" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);


const InputGroup = ({ label, isTextArea = false, error, disabled, ...props }) => (
    <div className="space-y-1 group w-full min-w-0">
        <div className="flex justify-between items-center min-h-3.5 sm:min-h-5">
            <label className={`text-start text-[8px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-widest px-1 transition-colors whitespace-nowrap ${error ? 'text-red-500' : 'text-primary'}`}>
                {label}
            </label>
        </div>

        <div className="relative">
            {isTextArea ? (
                <textarea rows="3" disabled={disabled}
                    className={`text-start w-full rounded-md sm:rounded-lg p-2 sm:p-4 text-[10px] xs:text-xs sm:text-base outline-none transition-all resize-none border 
                        ${error ? 'border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : 'border-border focus:border-primary focus:shadow-[0_0_0_2px_rgba(176,100,25,0.2)]'} 
                        bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(0,0,0,0.2)] placeholder:text-text/50 text-text disabled:opacity-50 disabled:cursor-not-allowed`}
                    {...props} />
            ) : (
                <input disabled={disabled}
                    className={`text-start w-full rounded-md sm:rounded-lg px-2 py-2 sm:px-4 sm:py-3 text-[10px] xs:text-xs sm:text-base outline-none transition-all border 
                        ${error ? 'border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : 'border-border focus:border-primary focus:shadow-[0_0_0_2px_rgba(176,100,25,0.2)]'} 
                        bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(0,0,0,0.2)] text-text
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    {...props} />
            )}
        </div>

        <div className="min-h-3 flex justify-start">
            {error && (
                <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[8px] sm:text-xs flex items-center gap-1 text-red-500 font-medium px-1">
                    <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3 shrink-0" />
                    <span className="truncate">{error}</span>
                </motion.span>
            )}
        </div>
    </div>
);


const SuccessMessage = ({ onReset, t }) => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-4 sm:py-12 text-center space-y-3 sm:space-y-6 h-full min-h-[250px] sm:min-h-[400px] w-full">

        <div className="relative">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-5px] sm:inset-2.5 rounded-full border-2 border-dashed opacity-30 border-primary" />

            <div className="w-12 h-12 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 shadow-xl border-primary bg-surface text-primary">
                <CheckCircle2 className="w-6 h-6 sm:w-12 sm:h-12" />
            </div>
        </div>

        <div className="space-y-1 sm:space-y-2 px-1 w-full">
            <h3 className="text-sm xs:text-lg sm:text-3xl font-bold py-4 text-text truncate">
                {t('contact.contactForm.successTitle')}
            </h3>
            <p className="max-w-full sm:max-w-sm mx-auto text-secondary text-[10px] xs:text-xs sm:text-base wrap-break-word leading-tight">
                {t('contact.contactForm.successMsg')}
            </p>
        </div>

        <button onClick={onReset} type="button"
            className="group font-bold tracking-widest uppercase text-[8px] xs:text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2 transition-all mt-2 sm:mt-4 text-primary hover:text-secondary bg-transparent py-1.5 px-3 sm:py-2 sm:px-4 rounded-full hover:bg-primary/5 whitespace-nowrap">
            <Scroll className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-y-0.5" />
            {t('contact.contactForm.btnAnother')}
        </button>
    </motion.div>
);


const FailureMessage = ({ onReset, t }) => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-4 sm:py-12 text-center space-y-3 sm:space-y-6 h-full min-h-[250px] sm:min-h-[400px] w-full">

        <div className="relative">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-5px] sm:inset-2.5 rounded-full border-2 border-dashed opacity-30 border-red-500" />

            <div className="w-12 h-12 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 shadow-xl border-red-500 bg-surface text-red-500">
                <AlertCircle className="w-6 h-6 sm:w-12 sm:h-12" />
            </div>
        </div>

        <div className="space-y-1 sm:space-y-2 px-1 w-full">
            <h3 className="text-sm xs:text-lg sm:text-3xl font-bold py-4 text-text truncate">
                {t('contact.contactForm.failureTitle')}
            </h3>
            <p className="max-w-full sm:max-w-sm mx-auto text-secondary text-[10px] xs:text-xs sm:text-base wrap-break-word leading-tight">
                {t('contact.contactForm.failureMsg')}
            </p>
        </div>

        <button onClick={onReset} type="button"
            className="group font-bold tracking-widest uppercase text-[8px] xs:text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2 transition-all mt-2 sm:mt-4 text-red-500 hover:text-secondary bg-transparent py-1.5 px-3 sm:py-2 sm:px-4 rounded-full hover:bg-red-500/10 whitespace-nowrap">
            <Scroll className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-y-0.5" />
            {t('contact.contactForm.btnTryAgain')}
        </button>
    </motion.div>
);


export default function ContactForm() {
    const { t, i18n } = useTranslation();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailure, setIsFailure] = useState(false);

    const formik = useFormik({
        initialValues: { name: '', email: '', message: '' },
        validationSchema: Yup.object({
            name: Yup.string().min(2, t('contact.contactForm.errMin')).required(t('contact.contactForm.errReq')),
            email: Yup.string().email(t('contact.contactForm.errEmail')).required(t('contact.contactForm.errReq')),
            message: Yup.string().required(t('contact.contactForm.errReq'))
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('message', values.message);

            try {
                const response = await fetch('https://getform.io/f/bpjxjzmb', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    setIsSuccess(true);
                    resetForm();
                } else {
                    setIsFailure(true);
                }
            } catch (error) {
                setIsFailure(true);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div dir={i18n.dir()} className="w-full lg:w-7/12 relative max-w-[600px] mx-auto lg:mx-0 px-0.5 xs:px-1">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                className="relative rounded-xl sm:rounded-2xl p-2 xs:p-4 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-md overflow-hidden"
                style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>

                <CornerDecoration className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 pointer-events-none" />
                <CornerDecoration className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 pointer-events-none rotate-90" />
                <CornerDecoration className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20 pointer-events-none -rotate-90" />
                <CornerDecoration className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 pointer-events-none rotate-180" />

                <AnimatePresence mode="wait">
                    {!isSuccess && !isFailure ? (
                        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={formik.handleSubmit}
                            className="space-y-3 xs:space-y-4 sm:space-y-7 mt-1 sm:mt-2 w-full">

                            <h3 className="text-sm xs:text-base sm:text-3xl md:text-4xl text-center pb-6 sm:pb-10 flex items-center justify-center gap-2 sm:gap-4 text-text font-bold flex-nowrap overflow-hidden">
                                <span className="h-px w-2 sm:w-10 bg-linear-to-r from-transparent to-primary block shrink-0"></span>
                                <span className="whitespace-nowrap truncate pb-5">{t('contact.contactForm.formTitle')}</span>
                                <span className="h-px w-2 sm:w-10 bg-linear-to-l from-transparent to-primary block shrink-0"></span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 w-full">
                                <InputGroup id="name" label={t('contact.contactForm.labelName')} placeholder={t('contact.contactForm.phName')} {...formik.getFieldProps('name')} error={formik.touched.name && formik.errors.name} disabled={formik.isSubmitting} />
                                <InputGroup id="email" label={t('contact.contactForm.labelEmail')} type="email" placeholder={t('contact.contactForm.phEmail')} {...formik.getFieldProps('email')} error={formik.touched.email && formik.errors.email} disabled={formik.isSubmitting} />
                            </div>

                            <InputGroup id="message" label={t('contact.contactForm.labelMsg')} isTextArea placeholder={t('contact.contactForm.phMsg')} {...formik.getFieldProps('message')} error={formik.touched.message && formik.errors.message} disabled={formik.isSubmitting} />

                            <button disabled={formik.isSubmitting} type="submit"
                                className="w-full mt-2 sm:mt-4 flex items-center justify-center gap-1 sm:gap-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none btn-primary-hero min-h-8 sm:min-h-11 py-1.5 sm:py-2">
                                {formik.isSubmitting ? (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <GiEgyptianProfile className="h-3 w-3 sm:h-5 sm:w-5 animate-spin text-button-primary-text" />
                                    </div>
                                ) : (
                                    <>
                                        <Send className="w-3 h-3 sm:w-5 sm:h-5" />
                                        <span className="tracking-widest font-bold text-[10px] xs:text-xs sm:text-base">
                                            {t('contact.contactForm.btnSend')}
                                        </span>
                                    </>
                                )}
                            </button>
                        </motion.form>
                    ) : isSuccess ? (
                        <SuccessMessage
                            onReset={() => { setIsSuccess(false); formik.resetForm(); }}
                            t={t}
                        />
                    ) : (
                        <FailureMessage
                            onReset={() => { setIsFailure(false); formik.resetForm(); }}
                            t={t}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
