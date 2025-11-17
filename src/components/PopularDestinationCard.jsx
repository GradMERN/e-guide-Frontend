import React from "react";

export default function PopularDestinationCard() {
  return (
    <div className="group relative h-60 w-full  rounded-lg overflow-hidden shadow-lg m-auto">
      <div className="group-hover:scale-115 absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1754254953079-52edd25752d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D')] bg-cover bg-center transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent"></div>
      </div>
      <div className="relative p-4 text-white flex flex-col justify-end h-full p-5">
        <h3 className="text-xl font-bold mb-2">Giza Pyramids</h3>
        <p className="text-sm">
          This is some example text for the card content
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-yellow-500">From $89</p>
          <button className="bg-yellow-400 hover:bg-yellow-700 text-white py-1 px-4 rounded-full">
            Explore &#x2192;
          </button>
        </div>
      </div>
    </div>
  );
}
