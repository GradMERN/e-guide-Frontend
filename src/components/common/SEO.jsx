import { useEffect } from "react";

/**
 * SEO Component - Updates document title and meta tags
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description for meta tag
 * @param {string} props.keywords - SEO keywords
 * @param {string} props.ogImage - Open Graph image URL
 */
const SEO = ({
  title = "Mystic Egypt Tours",
  description = "Your gateway to the wonders of Ancient Egypt. Experience history, culture, and adventure like never before.",
  keywords = "Egypt tours, pyramids, ancient Egypt, travel, guided tours, Nile cruise",
  ogImage = "/og-image.jpg",
}) => {
  useEffect(() => {
    // Update title
    document.title = title.includes("Mystic Egypt")
      ? title
      : `${title} | Mystic Egypt Tours`;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    // Update Open Graph tags
    const ogTags = [
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: "website" },
    ];

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Cleanup function to reset title when component unmounts
    return () => {
      // Optional: Reset to default title on unmount
    };
  }, [title, description, keywords, ogImage]);

  return null;
};

export default SEO;
