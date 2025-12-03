export default function SectionWrapperFull({ children }) {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-14 pt-0 pb-20 sm:pb-20 md:pb-28">
      {children}
    </section>
  );
};