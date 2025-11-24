import React from 'react'
import TourGuidesSlider from '../tourGuides/TourGuideSlider.jsx';
import guide1 from '../../assets/images/guide1.avif';
import guide2 from '../../assets/images/guide2.avif';
import guide3 from '../../assets/images/guide3.avif';

export default function TourGuidesSection() {

     const tourGuides = [
    {
      name: "Yacin Samy",
      designation: "Egyptologist",
      quote: "I love guiding travelers through Egypt's greatest historical sites.",
      src: guide1
    },
    {
      name: "Ahmed Samy",
      designation: "Senior Tour Guide",
      quote: "History is a story, and I make you feel part of it.",
      src: guide2
    },
    {
      name: "Omar Fayed",
      designation: "Local Cultural Expert",
      quote: "My mission is to show Egypt from the heart of its people.",
      src: guide3
    }
  ];


    return (
        <section className=" py-20 px-5 font-bold text-white text-center ">

            <div className="title ">

                <p className="text-[#ffd97e] text-sm tracking-[0.25em]  uppercase mb-2">GUIDED BY HISTORY</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 ">Meet Our Experts</h2>
                <div className="w-15 h-1  sm:w-30 sm:h-1.5  mx-auto  rounded-md bg-linear-to-r from-[#ffd97e] via-[#848281] to-[#ffd97e]"></div>

            </div>


            <div className='cards'>

               <TourGuidesSlider tourGuides={tourGuides} autoplay={false} />
                

            </div>

            <div className=''>
            <button className=" w-fit px-7 py-3 rounded-full bg-[#0c192d] hover:bg-[#e4c67a] cursor-pointer
              text-[#e4c67a] hover:text-[#0c192d] font-semibold  border  border-[#e4c67a] transition-all duration-300 text-right shadow-3xl">
              Explore More
            </button>
            </div>


        </section>

    )
}
