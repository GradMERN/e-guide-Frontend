import ContactInfo from '../../components/contact/ContactInfo';
import ContactForm from './../../components/contact/ContactForm';

const ContactUs = () => {

    return (
        <div className="min-h-screen relative overflow-hidden transition-colors duration-500 pt-55 px-4 sm:px-6 bg-background text-text w-full max-w-[100vw]">


            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none opacity-20 bg-primary" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none opacity-20 bg-secondary" />


            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30h10v10H30zM10 10h10v10H10z' fill='%23b06419' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

            <div className="max-w-7xl mx-auto space-y-15 pb-40 relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center justify-center">
                <ContactInfo />
                <ContactForm />
            </div>
        </div>
    );
};

export default ContactUs;