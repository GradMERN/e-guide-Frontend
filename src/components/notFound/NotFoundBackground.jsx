import { PixelatedCanvasDemo } from "../notFound/PixelatedCanvas";

export default function NotFoundBackground() {
  return (
    <div className="flex-1 w-full max-w-3xl h-64 sm:h-80 md:h-96 lg:h-[450px] xl:h-[550px] relative order-1 lg:order-2 mx-auto">
      <div className="hidden lg:block absolute rounded-xl" style={{ width: "calc(100% + 50px)", height: "90%", top: "0", left: "-25px",  background: "linear-gradient(135deg, rgba(207, 170, 101, 0.3) 0%, rgba(255, 217, 127, 0.3) 50%, rgba(255, 230, 160, 0.3) 100%)", zIndex: 0 }}/>
      <div className="hidden lg:flex absolute inset-0 rounded-xl overflow-hidden w-full h-full items-center justify-center p-4">
        <PixelatedCanvasDemo />
      </div>
    </div>
  );
}