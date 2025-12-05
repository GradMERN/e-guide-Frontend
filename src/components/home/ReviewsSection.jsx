import { useTranslation } from "react-i18next";
import { MdOutlineReviews } from "react-icons/md";
import TitlesHome from "../common/TitlesHome";
import { InfiniteMovingCards } from "../ui/InfiniteMovingCards";

export default function ReviewsSection() {
  const { t } = useTranslation();

  const reviews = [
    {
      name: "Alice Johnson",
      review: "Amazing experience, would highly recommend!",
      rating: 5,
    },
    {
      name: "Bob Smith",
      review: "Loved the journey, the service was top-notch.",
      rating: 4,
    },
    {
      name: "Carol White",
      review: "A memorable trip with wonderful guides.",
      rating: 5,
    },
    {
      name: "David Brown",
      review: "An unforgettable adventure with great people.",
      rating: 4,
    },
    {
      name: "Emma Davis",
      review: "Beautiful scenery and excellent planning.",
      rating: 5,
    },
    {
      name: "Frank Miller",
      review: "Smooth experience, highly organized tour.",
      rating: 4,
    },
    {
      name: "Grace Lee",
      review: "Everything went perfectly, loved it!",
      rating: 5,
    },
    {
      name: "Henry Wilson",
      review: "Fun experience, learned a lot.",
      rating: 4,
    },
    {
      name: "Ivy Clark",
      review: "Would go again without hesitation!",
      rating: 5,
    },
    {
      name: "Jack Thompson",
      review: "Great guides and amazing locations.",
      rating: 5,
    },
    {
      name: "Karen Lewis",
      review: "Very well organized, enjoyed every moment.",
      rating: 4,
    },
    {
      name: "Leo Robinson",
      review: "Fantastic trip, unforgettable memories.",
      rating: 5,
    },
    {
      name: "Mia Walker",
      review: "Perfect balance of adventure and relaxation.",
      rating: 5,
    },
    {
      name: "Noah Hall",
      review: "Highly recommend this journey to everyone.",
      rating: 4,
    },
    {
      name: "Olivia Young",
      review: "Friendly guides and incredible sights.",
      rating: 5,
    },
    {
      name: "Paul Allen",
      review: "The trip exceeded all expectations.",
      rating: 5,
    },
    {
      name: "Quinn Scott",
      review: "Wonderful experience, learned so much.",
      rating: 4,
    },
    {
      name: "Ruby Adams",
      review: "Incredible places, fantastic guides.",
      rating: 5,
    },
    { name: "Sam Baker", review: "A truly memorable adventure.", rating: 4 },
    {
      name: "Tina Evans",
      review: "Highly professional and fun trip!",
      rating: 5,
    },
  ];

  return (
    <div className="pb-10 sm:pb-10 md:pb-28">
      <TitlesHome
        icon={MdOutlineReviews}
        title={t("reviewsSection.title")}
        paragraph={t("reviewsSection.description")}
      />

      <InfiniteMovingCards
        items={reviews}
        direction="left"
        speed="fast"
        pauseOnHover={true}
      />
    </div>
  );
}
