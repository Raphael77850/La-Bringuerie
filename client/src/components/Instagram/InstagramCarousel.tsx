import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import "../../App.css";

import img1 from "../../assets/images/fidel-unsplash.jpg";
import img2 from "../../assets/images/fidel-unsplash.jpg";
import img3 from "../../assets/images/fidel-unsplash.jpg";
import img4 from "../../assets/images/fidel-unsplash.jpg";
import img5 from "../../assets/images/fidel-unsplash.jpg";

const images = [img1, img2, img3, img4, img5, img1, img2, img3];

export default function InstagramCarousel() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 4,
      spacing: 20,
      origin: "center",
    },
    breakpoints: {
      "(max-width: 900px)": {
        slides: { perView: 2, spacing: 10, origin: "center" },
      },
      "(max-width: 600px)": {
        slides: { perView: 1, spacing: 6, origin: "center" },
      },
    },
    renderMode: "performance",
    drag: true,
  });

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={sliderRef}
        className="keen-slider"
        style={{ maxWidth: 320 * 4, margin: "0 auto" }}
      >
        {images.map((img) => (
          <div
            className="keen-slider__slide"
            key={img}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={img}
              alt="Instagram"
              className="instagram-photo"
              style={{
                width: "100%",
                maxWidth: 240,
                aspectRatio: "3 / 4",
                height: "auto",
                objectFit: "cover",
                borderRadius: 16,
                background: "#FFF3E0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                margin: "0 auto",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
