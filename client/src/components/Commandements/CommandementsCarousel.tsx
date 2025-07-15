import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import "../../styles/commandements.css";

import img2 from "../../assets/images/1Commandements.png";
import img3 from "../../assets/images/2Commandements.png";
import img4 from "../../assets/images/3Commandements.png";
import img5 from "../../assets/images/4Commandements.png";
import img6 from "../../assets/images/5Commandements.png";
import img7 from "../../assets/images/6Commandements.png";
import img8 from "../../assets/images/7Commandements.png";
import img9 from "../../assets/images/8Commandements.png";
import img10 from "../../assets/images/9Commandements.png";
import img11 from "../../assets/images/10Commandements.png";

const images = [img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

export default function CommandementsCarousel() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 5,
      spacing: 20,
      origin: "center",
    },
    breakpoints: {
      "(max-width: 900px)": {
        slides: { perView: 4, spacing: 10, origin: "center" },
      },
      "(max-width: 600px)": {
        slides: { perView: 1, spacing: 6, origin: "center" },
      },
    },
    renderMode: "performance",
    drag: true,
  });

  return (
    <div className="commandements-carousel-container">
      <div ref={sliderRef} className="keen-slider commandements-slider">
        {images.map((img) => (
          <div className="keen-slider__slide commandements-slide" key={img}>
            <img
              src={img}
              alt="Commandement du Bringueur"
              className="commandement-photo"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
