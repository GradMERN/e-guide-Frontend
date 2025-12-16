import { motion } from 'framer-motion';
import { MapPin, Phone, Scroll } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactCard = ({ icon, title, detail }) => (
    <div className="group flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-primary/10 bg-surface/40 backdrop-blur-md w-full max-w-[280px] sm:max-w-none hover:bg-surface/60 hover:border-primary/20 transition-all duration-300">

        <div className="shrink-0 relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg bg-linear-to-br from-primary via-secondary to-secondary group-hover:scale-105 transition-transform duration-300">
            {icon}
        </div>

        <div className="min-w-0 flex-1 w-full text-center sm:text-start">
            <h3 className="font-bold text-xs sm:text-lg text-primary mb-0.5 whitespace-nowrap truncate">{title}</h3>
            <p className="font-medium text-[10px] sm:text-sm text-text/80 leading-snug whitespace-nowrap truncate">{detail}</p>
        </div>
    </div>
);

export default function ContactInfo() {
    const { t, i18n } = useTranslation();

    return (
        <div  dir={i18n.dir()}  className="w-full lg:w-5/12 flex flex-col items-center lg:items-start justify-center gap-6 sm:gap-10 px-2 sm:px-0 text-center lg:text-start">

            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="w-full flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-3 mb-2 sm:mb-4">
                    <span className="h-px w-8 sm:w-12 bg-primary/60 rounded-full"></span>
                    <span className="uppercase tracking-[0.2em] text-[9px] sm:text-xs font-bold text-primary whitespace-nowrap">{t('contact.subtitle')}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary drop-shadow-sm leading-tight whitespace-nowrap truncate w-full">
                    {t('contact.title')}
                </h1>

                <div className="w-full max-w-xl lg:border-s-4 lg:ps-6 text-xs sm:text-base md:text-lg text-secondary/90 leading-relaxed">
                    <p className="px-1">{t('contact.desc')}</p>
                </div>

            </motion.div>

            <motion.div className="w-full flex flex-col gap-3 sm:gap-5 items-center lg:items-stretch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>

                <ContactCard icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />} title={t('contact.addressTitle')} detail={t('contact.address')} />
                <ContactCard icon={<Phone className="w-4 h-4 sm:w-5 sm:h-5" />} title={t('contact.phoneTitle')} detail={t('contact.phone')} />
                <ContactCard icon={<Scroll className="w-4 h-4 sm:w-5 sm:h-5" />} title={t('contact.emailTitle')} detail={t('contact.email')} />

            </motion.div>
        </div>
    );
}
