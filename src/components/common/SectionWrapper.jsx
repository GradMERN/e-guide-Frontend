export default function SectionWrapperFull({ children, className = "", id, px = "px-4 sm:px-6 md:px-10 lg:px-14", py = "pt-0 pb-20 sm:pb-20 md:pb-28",}) {
  return (
    <section id={id} className={`w-full ${px} ${py} ${className}`}>
      {children}
    </section>
  );
};