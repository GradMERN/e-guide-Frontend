import { PixelatedCanvasDemo } from "../notFound/PixelatedCanvas";

export default function NotFoundBackground() {
  return (
    <div className="flex-1 w-full lg:w-full max-w-full lg:max-w-7xl h-64 sm:h-80 md:h-96 lg:h-[70vh] relative order-1 lg:order-2">
      <div
        className="hidden lg:block absolute rounded-xl"
        style={{
          width: "calc(100% + 50px)",
          height: "90%",
          top: "0", 
          left: "-25px",
          background: "linear-gradient(135deg, rgba(255, 223, 127, 0.3) 0%, rgba(226, 199, 132, 0.3) 50%, rgba(199, 161, 92, 0.3) 100%)", zIndex: 0,
        }}
      ></div>
      <div className="absolute inset-0 rounded-xl overflow-hidden w-full h-full">
        <PixelatedCanvasDemo />
      </div>
    </div>
  );
}
