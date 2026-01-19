import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta?: string;
  onCTA?: () => void;
}

interface BannerCarouselProps {
  slides?: BannerSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const defaultSlides: BannerSlide[] = [
  {
    id: "1",
    title: "50% Off Everything",
    subtitle: "Limited time offer - Shop our biggest sale",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop",
    cta: "Shop Sale",
  },
  {
    id: "2",
    title: "New Collection",
    subtitle: "Discover our latest arrivals this season",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=500&fit=crop",
    cta: "View Collection",
  },
  {
    id: "3",
    title: "Free Shipping",
    subtitle: "On orders over $50 - Use code SHIP50",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=500&fit=crop",
    cta: "Order Now",
  },
];

export default function BannerCarousel({
  slides = defaultSlides,
  autoPlay = true,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-96 sm:h-[500px] overflow-hidden rounded-xl shadow-lg bg-slate-200">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl animate-fade-in">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-blue-100 mb-8">
                    {slide.subtitle}
                  </p>
                  {slide.cta && (
                    <Button
                      onClick={slide.onCTA}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
                    >
                      {slide.cta}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-slate-900" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-slate-900" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8 h-3"
                : "bg-white bg-opacity-50 hover:bg-opacity-75 w-3 h-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Autoplay indicator */}
      {autoPlay && (
        <div className="absolute top-6 right-6 z-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-semibold">
          Slide {currentSlide + 1} / {slides.length}
        </div>
      )}
    </section>
  );
}
