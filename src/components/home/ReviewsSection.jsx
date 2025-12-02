import { MdOutlineReviews } from "react-icons/md";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";
import { InfiniteMovingCards } from "../ui/InfiniteMovingCards";


export default function ReviewsSection() {
const reviews = [
  { quote: "Visiting Egypt was the best decision I ever made. The historical sites were breathtaking!", name: "Sarah Johnson" },
  { quote: "Luxor and Aswan offer a magical experience. The Nile cruise was unforgettable.", name: "Michael Roberts" },
  { quote: "The culture, the people, the food — Egypt exceeded all my expectations.", name: "Emily Carter" },
  { quote: "Cairo was vibrant and full of life. The pyramids truly left me speechless.", name: "David Hassan" },
  { quote: "Exploring the temples in Luxor was a dream come true!", name: "Anna Lee" },
  { quote: "The Egyptian Museum is a must-visit for history enthusiasts.", name: "Tom Williams" },
  { quote: "The Red Sea snorkeling was spectacular. Highly recommend!", name: "Laura Smith" },
  { quote: "I loved the local cuisine and street markets. A feast for the senses!", name: "Mark Thompson" },
  { quote: "Sunsets over the Nile are unforgettable. Pure magic.", name: "Sophia Brown" },
  { quote: "Visiting the pyramids was like stepping back in time. Incredible experience.", name: "James Wilson" },
  { quote: "The boat ride on the Nile at sunrise was surreal.", name: "Olivia Davis" },
  { quote: "Egypt’s ancient history comes alive in every corner. Amazing trip!", name: "William Clark" },
  { quote: "Aswan’s peaceful vibe and natural beauty were exactly what I needed.", name: "Grace Hall" },
  { quote: "The local guides were knowledgeable and made the tour unforgettable.", name: "Henry Lewis" },
  { quote: "I can’t wait to return! Egypt has captured my heart.", name: "Chloe Martin" },
  { quote: "The desert safari was thrilling and an experience I’ll never forget.", name: "Liam Scott" },
  { quote: "From pyramids to temples, every site was a wonder to behold.", name: "Ella Turner" },
  { quote: "The Nile cruise allowed me to see so much of Egypt in comfort.", name: "Noah Walker" },
  { quote: "Historic sites, vibrant markets, and warm people – Egypt has it all.", name: "Isabella King" },
  { quote: "Every day in Egypt was filled with awe and discovery.", name: "Lucas Adams" },
];


  return (
    <SectionWrapperFull>
      <TitlesHome
        icon={MdOutlineReviews}
        title="Traveler Reviews"
        paragraph="Real experiences shared by travelers who explored the wonders of Egypt — stories that bring each destination to life with authentic insights and memorable moments."
      />

      <InfiniteMovingCards
          items={reviews}
          direction="left"
          speed="fast"
          pauseOnHover={true}
        />
    </SectionWrapperFull>
  );
};
