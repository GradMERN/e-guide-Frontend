import TourGuidesSlider from '../tourGuides/TourGuideSlider.jsx';
import guide1 from '../../assets/images/guide1.avif';
import guide2 from '../../assets/images/guide2.avif';
import guide3 from '../../assets/images/guide3.avif';
import SectionWrapperFull from '../common/SectionWrapper.jsx';
import TitlesHome from '../common/TitlesHome.jsx';
import { TbUserCheck } from 'react-icons/tb';

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
    <SectionWrapperFull className=" py-20 px-5 font-bold text-white text-center ">

      <TitlesHome icon={TbUserCheck} title="Meet Our Experts" paragraph="Guided by history, our certified tour guides will make your journey through Egypt unforgettable."/>



      <div className='cards'>

        <TourGuidesSlider tourGuides={tourGuides} autoplay={false} />

      </div>



    </SectionWrapperFull>

  )
}
