import React from "react";
import PopularDestinationCard from "./PopularDestinationCard";
export default function PopularDestinations() {
  return (
    <>
      <h1 className="p-5 text-4xl text-center text-gray-800">Popular Destinations</h1>
      <hr className=" bg-linear-to-r from-white-500  via-yellow-500 to-white-500 border-none h-1 w-30 m-auto my-5" />
      <p className="text-center italic text-gray-700 ">Discover the most breathtaking historical sites across Egypt</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6">
        <PopularDestinationCard></PopularDestinationCard>
        <PopularDestinationCard></PopularDestinationCard>
        <PopularDestinationCard></PopularDestinationCard>
        <PopularDestinationCard></PopularDestinationCard>
        <PopularDestinationCard></PopularDestinationCard>
        <PopularDestinationCard></PopularDestinationCard>
      </div>
    </>
  );
}
