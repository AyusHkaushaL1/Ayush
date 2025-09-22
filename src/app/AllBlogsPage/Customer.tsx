"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blogData } from "../Data/blogData";
import Card from "../Blogs/Card";

const Customer: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = 3;
  const gap = 24;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const totalWidth = containerRef.current.offsetWidth;
      setCardWidth((totalWidth - gap * (visibleCards - 1)) / visibleCards);
    }
    const handleResize = () => {
      if (containerRef.current) {
        const totalWidth = containerRef.current.offsetWidth;
        setCardWidth((totalWidth - gap * (visibleCards - 1)) / visibleCards);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gap, visibleCards]);

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? blogData.length - visibleCards : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCards >= blogData.length ? 0 : prev + 1
    );
  };

  return (
    <div className="w-full py-12 bg-[#f4f2ec] relative">
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition z-10"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="overflow-hidden w-full max-w-[1800px]" ref={containerRef}>
          <div
            className="flex transition-transform duration-500"
            style={{
              gap: `${gap}px`,
              transform: `translateX(-${startIndex * (cardWidth + gap)}px)`,
            }}
          >
            {blogData.map((blog) => (
              <div
                key={blog.id}
                className="flex-shrink-0"
                style={{ width: `${cardWidth}px` }}
              >
                <Card
                  image={blog.image}
                  title={blog.title}
                  date={blog.date}
                  description={blog.description}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition z-10"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default Customer;
