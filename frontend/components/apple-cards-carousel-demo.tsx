"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-white font-sans">
        Explore our <span className="gradient-text">destinations</span>
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

function DestinationContent({ city, description, highlights }: { city: string; description: string; highlights: string[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-white">{city}</span>{" "}
        {description}
      </p>
      <ul className="mt-6 space-y-2 max-w-3xl mx-auto">
        {highlights.map((h) => (
          <li key={h} className="text-neutral-400 text-sm flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

const data = [
  {
    category: "Popular Route",
    title: "New York to Los Angeles",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DestinationContent city="JFK → LAX" description="is one of our most popular routes. With multiple daily departures and competitive pricing, coast-to-coast travel has never been easier." highlights={["5h 30m average flight time", "Non-stop flights available daily", "Starting from $189 one-way"]} />,
  },
  {
    category: "Business Hub",
    title: "Chicago to San Francisco",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DestinationContent city="ORD → SFO" description="connects two of America's greatest cities. Perfect for business travelers and tech professionals making the Midwest-to-West Coast hop." highlights={["4h 15m direct flights", "Wi-Fi available on all flights", "Priority boarding for business class"]} />,
  },
  {
    category: "Tropical Escape",
    title: "Miami to the Caribbean",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DestinationContent city="MIA → Caribbean" description="offers the perfect tropical getaway. Crystal-clear waters and white sand beaches are just a short flight away from the Magic City." highlights={["2-3h flight times", "Weekend getaway packages", "Flexible cancellation policies"]} />,
  },
  {
    category: "Mountain Views",
    title: "Seattle to Denver",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DestinationContent city="SEA → DEN" description="takes you from the Pacific Northwest to the Rocky Mountains. Experience two of America's most stunning natural landscapes in a single trip." highlights={["3h 30m flight time", "Stunning aerial views", "Ski season specials available"]} />,
  },
  {
    category: "East Coast",
    title: "Boston to Washington DC",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DestinationContent city="BOS → DCA" description="is the quintessential East Coast corridor route. Ideal for business meetings, museum visits, and exploring America's capital." highlights={["1h 30m express flights", "Hourly departures", "From $99 one-way"]} />,
  },
  {
    category: "Sun Belt",
    title: "Dallas to Phoenix",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DestinationContent city="DFW → PHX" description="connects the heart of Texas to the desert Southwest. Year-round sunshine and growing tech hubs make this a favorite route." highlights={["2h 45m flight time", "Multiple daily departures", "Golf and resort packages"]} />,
  },
];
