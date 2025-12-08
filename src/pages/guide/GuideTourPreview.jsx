import React from "react";
import { useParams } from "react-router-dom";
import TourPreview from "../../components/guide/TourPreview";

export default function GuideTourPreview() {
  const { tourId } = useParams();

  return <TourPreview tourId={tourId} />;
}
